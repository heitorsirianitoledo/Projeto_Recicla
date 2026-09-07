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
}