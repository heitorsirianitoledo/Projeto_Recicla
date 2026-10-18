import { Router } from 'express';
import { loginController, registerController } from '../controllers/authController.js';
import { criarAgendamento, listarMeusAgendamentos } from '../controllers/agendamentoController.js';
import { autenticarToken, autorizarPerfis } from '../middlewares/authMiddleware.js';

const router = Router();

// Rotas públicas de autenticação
router.post('/auth/login', loginController);
router.post('/auth/register', registerController);

// Rotas de agendamentos protegidas por token
router.post(
  '/agendamentos',
  autenticarToken,
  autorizarPerfis('gestor', 'GESTOR_RESIDUOS'),
  criarAgendamento
);

router.get(
  '/agendamentos',
  autenticarToken,
  listarMeusAgendamentos
);

export default router;