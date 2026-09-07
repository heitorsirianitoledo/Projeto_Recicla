import { Router } from 'express';
import { loginController } from '../controllers/authController.js';
import { criarAgendamento, listarMeusAgendamentos } from '../controllers/agendamentoController.js';
import { autenticarToken, autorizarPerfis } from '../middlewares/authMiddleware.js';

const router = Router();


router.post('/auth/login', loginController);


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