import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

export class AuthService {
  static async login(email, senha) {
    const { rows } = await pool.query(
      'SELECT id_usuario, nome, email, senha_hash, tipo_usuario, instituicao_id, ativo FROM usuario WHERE email = $1',
      [email]
    );

    const usuario = rows[0];
    if (!usuario || !usuario.ativo) {
      throw new Error('Credenciais inválidas ou usuário desativado.');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      throw new Error('Credenciais inválidas ou usuário desativado.');
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        tipo_usuario: usuario.tipo_usuario,
        instituicao_id: usuario.instituicao_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return {
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo_usuario
      },
      token
    };
  }

  static async registrar({ nome, cnpj, endereco, telefone, email, senha, perfil = 'gestor' }) {
    const checkEmail = await pool.query('SELECT id_usuario FROM usuario WHERE email = $1', [email]);
    if (checkEmail.rows.length > 0) {
      throw new Error('Este e-mail já está cadastrado no sistema.');
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      const queryInstituicao = `
        INSERT INTO instituicao (nome, cnpj, endereco, telefone)
        VALUES ($1, $2, $3, $4)
        RETURNING id_instituicao;
      `;
      const resInstituicao = await client.query(queryInstituicao, [nome, cnpj, endereco, telefone]);
      const instituicaoId = resInstituicao.rows[0].id_instituicao;

      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(senha, salt);

      const queryUsuario = `
        INSERT INTO usuario (nome, email, senha_hash, tipo_usuario, instituicao_id, ativo)
        VALUES ($1, $2, $3, $4, $5, true)
        RETURNING id_usuario, nome, email, tipo_usuario, instituicao_id;
      `;
      const resUsuario = await client.query(queryUsuario, [
        nome,
        email,
        senhaHash,
        perfil,
        instituicaoId
      ]);

      await client.query('COMMIT');

      return resUsuario.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}