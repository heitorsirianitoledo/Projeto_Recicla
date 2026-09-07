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