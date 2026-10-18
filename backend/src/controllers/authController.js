import { AuthService } from '../services/authService.js';

export const loginController = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }
    const resultado = await AuthService.login(email, senha);
    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
};

export const registerController = async (req, res) => {
  try {
    const { nome, cnpj, endereco, telefone, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const novoUsuario = await AuthService.registrar({
      nome,
      cnpj,
      endereco,
      telefone,
      email,
      senha,
      perfil: 'gestor'
    });

    return res.status(201).json({
      mensagem: 'Instituição e usuário cadastrados com sucesso!',
      usuario: novoUsuario
    });
  } catch (err) {
    console.error('ERRO DETALHADO NO REGISTO:', err);
    return res.status(400).json({ erro: err.message || err.detail || 'Erro ao processar registo' });
  }
};