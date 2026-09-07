import { AgendamentoService } from '../services/agendamentoService.js';

export const criarAgendamento = async (req, res) => {
  try {
    const { ponto_coleta_id, data_agendada, itensResiduos } = req.body;
    const instituicao_id = req.usuario.instituicao_id;

    if (!ponto_coleta_id || !data_agendada) {
      return res.status(400).json({ erro: 'Ponto de coleta e data são obrigatórios.' });
    }

    const agendamento = await AgendamentoService.criarSolicitacao({
      instituicao_id,
      ponto_coleta_id,
      data_agendada,
      itensResiduos
    });

    return res.status(201).json({
      mensagem: 'Agendamento solicitado com sucesso!',
      agendamento
    });
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

export const listarMeusAgendamentos = async (req, res) => {
  try {
    const instituicao_id = req.usuario.instituicao_id;
    const dados = await AgendamentoService.listarPorInstituicao(instituicao_id);
    return res.status(200).json(dados);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao listar agendamentos.' });
  }
};