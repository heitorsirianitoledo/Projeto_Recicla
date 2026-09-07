import { pool } from '../config/database.js';

export class AgendamentoService {
  static async criarSolicitacao({ instituicao_id, ponto_coleta_id, data_agendada, itensResiduos }) {
    const dataAlvo = new Date(data_agendada);
    if (dataAlvo < new Date()) {
      throw new Error('A data do agendamento deve ser posterior à data e hora atual.');
    }

    if (!itensResiduos || itensResiduos.length === 0) {
      throw new Error('Informe ao menos um tipo de resíduo para a coleta.');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const sqlAgendamento = `
        INSERT INTO agendamento (instituicao_id, ponto_coleta_id, data_agendada, status)
        VALUES ($1, $2, $3, 'pendente')
        RETURNING id_agendamento, status, data_agendada;
      `;
      const resAgendamento = await client.query(sqlAgendamento, [
        instituicao_id,
        ponto_coleta_id,
        data_agendada
      ]);
      const agendamentoCriado = resAgendamento.rows[0];

      const sqlResiduo = `
        INSERT INTO residuo_coleta (agendamento_id, tipo_residuo_id, quantidade, unidade)
        VALUES ($1, $2, $3, $4);
      `;

      for (const item of itensResiduos) {
        await client.query(sqlResiduo, [
          agendamentoCriado.id_agendamento,
          item.tipo_residuo_id,
          item.quantidade,
          item.unidade || 'kg'
        ]);
      }

      await client.query(
        `INSERT INTO notificacao (usuario_id, tipo, mensagem, lida, data_criacao)
         VALUES ($1, 'NOVO_AGENDAMENTO', 'Nova solicitação de coleta recebida.', false, NOW())`,
        [ponto_coleta_id]
      );

      await client.query('COMMIT');
      return agendamentoCriado;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async listarPorInstituicao(instituicao_id) {
    const sql = `
      SELECT a.id_agendamento, a.data_agendada, a.status, p.nome as nome_ponto_coleta
      FROM agendamento a
      JOIN ponto_coleta p ON a.ponto_coleta_id = p.id_ponto_coleta
      WHERE a.instituicao_id = $1
      ORDER BY a.data_agendada DESC;
    `;
    const { rows } = await pool.query(sql, [instituicao_id]);
    return rows;
  }
}