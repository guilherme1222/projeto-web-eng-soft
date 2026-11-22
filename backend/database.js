const { Pool } = require('pg');
const crypto = require('crypto'); // Para gerar UUIDs

// Configuração da conexão com o banco de dados
const pool = new Pool({
  user: 'dev',
  host: '127.0.0.1',
  database: 'diskapi',
  password: 'dev',
  port: 5432,
});

const DEFAULT_ADMIN = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Administrador',
  username: 'admin',
  email: 'admin@diskpelada.com',
  cpf: '00000000000',
  password: 'admin123',
  birthday: '1990-01-01',
};

async function ensureAuthSchema() {
  try {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role varchar(20) NOT NULL DEFAULT 'player';
    `);

    await pool.query(`
      UPDATE users
      SET role = 'manager'
      WHERE id IN (SELECT user_id FROM manager)
        AND role IS DISTINCT FROM 'admin';
    `);

    await pool.query(`
      UPDATE users
      SET role = 'player'
      WHERE role IS NULL;
    `);

    await pool.query(
      `
      INSERT INTO users (id, name, username, email, cpf, password, birthday, user_created_date, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, 'admin')
      ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name,
          username = EXCLUDED.username,
          cpf = EXCLUDED.cpf,
          password = EXCLUDED.password,
          birthday = EXCLUDED.birthday,
          role = 'admin';
      `,
      [
        DEFAULT_ADMIN.id,
        DEFAULT_ADMIN.name,
        DEFAULT_ADMIN.username,
        DEFAULT_ADMIN.email,
        DEFAULT_ADMIN.cpf,
        DEFAULT_ADMIN.password,
        DEFAULT_ADMIN.birthday,
      ],
    );

    console.log('✅ Estrutura de autenticação verificada.');
  } catch (error) {
    console.error('Erro ao preparar autenticação:', error.message);
    throw error;
  }
}

async function getUserById(userId) {
  const query = `
    SELECT
      u.id,
      u.name,
      u.username,
      u.email,
      COALESCE(u.role, CASE WHEN m.user_id IS NOT NULL THEN 'manager' ELSE 'player' END) AS role
    FROM users u
    LEFT JOIN manager m ON m.user_id = u.id
    WHERE u.id = $1;
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows[0] || null;
}

async function listarUsuarios() {
  try {
    const query = `
      SELECT
        u.id,
        u.name,
        u.username,
        u.email,
        COALESCE(u.role, CASE WHEN m.user_id IS NOT NULL THEN 'manager' ELSE 'player' END) AS role
      FROM users u
      LEFT JOIN manager m ON m.user_id = u.id
      ORDER BY u.name ASC;
    `;

    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Erro ao listar usuários:', error.message);
    throw error;
  }
}

async function atualizarRoleUsuario(userId, role) {
  if (!['player', 'manager'].includes(role)) {
    throw new Error('Role inválida para alteração.');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `
      SELECT id, role
      FROM users
      WHERE id = $1;
      `,
      [userId],
    );

    if (rows.length === 0) {
      throw new Error('Usuário não encontrado.');
    }

    const currentRole = rows[0].role || 'player';

    if (currentRole === 'admin') {
      throw new Error('O administrador não pode ter o papel alterado.');
    }

    await client.query(
      `
      UPDATE users
      SET role = $2
      WHERE id = $1;
      `,
      [userId, role],
    );

    if (role === 'manager') {
      await client.query(
        `
        INSERT INTO manager (user_id, chave_pix, cnpj)
        VALUES ($1, NULL, NULL)
        ON CONFLICT (user_id) DO NOTHING;
        `,
        [userId],
      );
    } else {
      await client.query('UPDATE sport_complex SET manager_id = NULL WHERE manager_id = $1;', [userId]);
      await client.query('DELETE FROM manager WHERE user_id = $1;', [userId]);
    }

    await client.query('COMMIT');
    return await getUserById(userId);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao atualizar papel do usuário:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 1. Validar Login
 * Busca o usuário pelo email e valida a senha.
 */
async function validarLogin(email, password) {
  try {
    // Busca na tabela users com o papel efetivo do usuário
    const query = `
      SELECT
        u.id,
        u.name,
        u.password,
        COALESCE(u.role, CASE WHEN m.user_id IS NOT NULL THEN 'manager' ELSE 'player' END) AS role
      FROM users u
      LEFT JOIN manager m ON m.user_id = u.id
      WHERE u.email = $1;
    `;
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 0) {
      return { sucesso: false, mensagem: 'Usuário não encontrado.' };
    }

    const usuario = rows[0];

    // ATENÇÃO: Em produção, você deve usar bcrypt.compare() no lugar da comparação direta!
    if (usuario.password === password) {
      return { sucesso: true, usuarioId: usuario.id, nome: usuario.name, role: usuario.role || 'player' };
    } else {
      return { sucesso: false, mensagem: 'Senha incorreta.' };
    }
  } catch (error) {
    console.error('Erro ao validar login:', error.message);
    throw error;
  }
}

/**
 * 2. Criar Partida
 * Insere um novo registro na tabela match.
 */
async function criarPartida(courtId, date, status = 'agendada') {
  try {
    const matchId = crypto.randomUUID(); // Gera o UUID para a tabela match
    const now = new Date();

    // Insere na tabela match usando as colunas corretas[cite: 1]
    const query = `
      INSERT INTO match (id, date, match_create_date, status, court_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [matchId, date, now, status, courtId];

    const { rows } = await pool.query(query, values);
    console.log('✅ Partida criada com sucesso!');
    return rows[0];
  } catch (error) {
    console.error('Erro ao criar partida:', error.message);
    throw error;
  }
}

async function criarQuadra({ name, type, hourValue, complexId = null }) {
  try {
    const courtId = crypto.randomUUID();
    const query = `
      INSERT INTO court (id, name, type, hour_value, complex_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [courtId, name, type, hourValue, complexId];
    const { rows } = await pool.query(query, values);

    return rows[0];
  } catch (error) {
    console.error('Erro ao criar quadra:', error.message);
    throw error;
  }
}

async function criarComplexoEQuadra({
  managerId = null,
  complexName,
  street = null,
  number = null,
  city = null,
  state = null,
  cep = null,
  cnpj = null,
  courtName,
  type,
  hourValue,
}) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const complexId = crypto.randomUUID();
    const courtId = crypto.randomUUID();

    await client.query(
      `
      INSERT INTO sport_complex (id, name, cnpj, cep, state, city, street, number, manager_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
      `,
      [complexId, complexName, cnpj, cep, state, city, street, number, managerId],
    );

    const { rows } = await client.query(
      `
      INSERT INTO court (id, name, type, hour_value, complex_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [courtId, courtName, type, hourValue, complexId],
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar complexo e quadra:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 3. Participar de uma Partida
 * Insere o usuário na tabela participation atrelado a uma partida.
 */
async function participarPartida(matchId, userId, quotaValue, paymentStatus = 'pendente') {
  try {
    // Insere na tabela participation, referenciando match_id e user_id[cite: 1]
    const query = `
      INSERT INTO participation (match_id, user_id, quota_value, payment_status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [matchId, userId, quotaValue, paymentStatus];

    const { rows } = await pool.query(query, values);
    console.log('✅ Participação confirmada!');
    return rows[0];
  } catch (error) {
    console.error('Erro ao registrar participação (verifique se já está participando):', error.message);
    throw error;
  }
}

/**
 * 4. Remover Participação
 * Deleta o registro do usuário na tabela participation de uma partida específica.
 */
async function removerParticipacao(matchId, userId) {
  try {
    // A chave primária é composta por (match_id, user_id)[cite: 1]
    const query = 'DELETE FROM participation WHERE match_id = $1 AND user_id = $2 RETURNING *;';
    const { rowCount } = await pool.query(query, [matchId, userId]);

    if (rowCount > 0) {
      console.log('✅ Participação removida com sucesso!');
      return true;
    } else {
      console.log('⚠️ Nenhuma participação encontrada para remover.');
      return false;
    }
  } catch (error) {
    console.error('Erro ao remover participação:', error.message);
    throw error;
  }
}

/**
 * 5. Listar Todas as Partidas
 * Retorna todas as partidas cadastradas na tabela match.
 */
async function listarTodasPartidas() {
  try {
    // Busca na tabela match com os dados da quadra e do complexo vinculados
    const query = `
      SELECT
        m.id,
        m.date,
        m.status,
        m.court_id,
        c.name AS court_name,
        c.hour_value,
        c.type AS court_type,
        sc.name AS complex_name,
        sc.street,
        sc.number,
        sc.city,
        sc.state,
        sc.cep,
        concat_ws(', ', sc.street, sc.number::text, sc.city, sc.state) AS local
      FROM match m
      LEFT JOIN court c ON c.id = m.court_id
      LEFT JOIN sport_complex sc ON sc.id = c.complex_id
      ORDER BY m.date DESC, m.match_create_date DESC;
    `;
    const { rows } = await pool.query(query);
    
    return rows;
  } catch (error) {
    console.error('Erro ao listar partidas:', error.message);
    throw error;
  }
}

/**
 * 6. Listar Partidas que um Usuário Participa
 * Faz um JOIN entre match e participation filtrando pelo user_id.
 */
async function listarPartidasDoUsuario(userId) {
  try {
    // Junta a tabela match com a participação, quadra e complexo para devolver a agenda completa
    const query = `
      SELECT
        m.id AS match_id,
        m.date,
        m.status,
        m.court_id,
        c.name AS court_name,
        c.hour_value,
        c.type AS court_type,
        sc.name AS complex_name,
        sc.street,
        sc.number,
        sc.city,
        sc.state,
        sc.cep,
        COALESCE(
          nullif(concat_ws(', ', sc.street, sc.number::text, sc.city, sc.state), ''),
          sc.name,
          c.name,
          'Endereço não informado'
        ) AS endereco,
        COALESCE(
          nullif(concat_ws(', ', sc.street, sc.number::text, sc.city, sc.state), ''),
          sc.name,
          c.name,
          'Endereço não informado'
        ) AS local,
        p.payment_status,
        p.quota_value
      FROM match m
      INNER JOIN participation p ON m.id = p.match_id
      LEFT JOIN court c ON c.id = m.court_id
      LEFT JOIN sport_complex sc ON sc.id = c.complex_id
      WHERE p.user_id = $1
      ORDER BY m.date DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    
    return rows;
  } catch (error) {
    console.error('Erro ao listar partidas do usuário:', error.message);
    throw error;
  }
}

/**
 * 7. Listar Quadras
 * Retorna as quadras cadastradas na tabela court com os dados da quadra e do complexo.
 */
async function listarQuadras() {
  try {
    const query = `
      SELECT
        c.id,
        c.name,
        c.hour_value,
        c.type,
        c.complex_id,
        sc.name AS complex_name,
        sc.city,
        sc.street,
        sc.number,
        sc.state,
        sc.cep
      FROM court c
      LEFT JOIN sport_complex sc ON sc.id = c.complex_id
      ORDER BY c.name ASC;
    `;

    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Erro ao listar quadras:', error.message);
    throw error;
  }
}

async function registerUser(userData, profileType = null, profileData = {}) {
  const client = await pool.connect();

  try {
    // Inicia a transação
    await client.query('BEGIN');

    // 1. Inserir na tabela base 'users'[cite: 1]
    const userId = crypto.randomUUID(); // Gera o UUID necessário para o campo id[cite: 1]
    const now = new Date();

    const insertUserQuery = `
      INSERT INTO users (id, name, username, email, cpf, password, birthday, user_created_date, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id;
    `;
    
    // Na vida real, a senha (userData.password) DEVE ser criptografada com bcrypt antes de salvar
    const userValues = [
      userId,
      userData.name,
      userData.username,
      userData.email,
      userData.cpf,
      userData.password, 
      userData.birthday,
      now, // timestamp(6) para o user_created_date[cite: 1]
      profileType === 'manager' ? 'manager' : 'player'
    ];

    await client.query(insertUserQuery, userValues);

    // 2. Inserir no perfil específico, se solicitado
    if (profileType === 'player') {
      // A tabela players exige user_id e permite media_desempenho e total_partidas_avaliadas[cite: 1]
      const insertPlayerQuery = `
        INSERT INTO players (user_id, media_desempenho, total_partidas_avaliadas)
        VALUES ($1, $2, $3);
      `;
      await client.query(insertPlayerQuery, [
        userId,
        profileData.media_desempenho || 0,
        profileData.total_partidas_avaliadas || 0
      ]);
      console.log(`✅ Jogador ${userData.username} cadastrado com sucesso!`);

    } else if (profileType === 'manager') {
      // A tabela manager exige user_id e permite chave_pix e cnpj[cite: 1]
      const insertManagerQuery = `
        INSERT INTO manager (user_id, chave_pix, cnpj)
        VALUES ($1, $2, $3);
      `;
      await client.query(insertManagerQuery, [
        userId,
        profileData.chave_pix || null,
        profileData.cnpj || null
      ]);
      console.log(`✅ Gerente ${userData.username} cadastrado com sucesso!`);
      
    } else {
      console.log(`✅ Usuário base ${userData.username} cadastrado com sucesso!`);
    }

    // Confirma a transação
    await client.query('COMMIT');
    return userId;

  } catch (error) {
    // Em caso de erro (ex: CPF/Email duplicado), desfaz tudo que foi feito
    await client.query('ROLLBACK');
    console.error('❌ Erro ao cadastrar usuário. Transação revertida:', error.message);
    throw error;
  } finally {
    // Libera o cliente de volta para o Pool
    client.release();
  }
}

/**
 * 8. Obter Receita da Plataforma
 * Soma o valor de todas as partidas (exceto canceladas) e calcula 10%
 */
async function obterReceitaPlataforma() {
  try {
    const query = `
      SELECT COALESCE(SUM(c.hour_value), 0) AS total_bruto
      FROM match m
      INNER JOIN court c ON m.court_id = c.id
      WHERE UPPER(m.status) != 'CANCELADA';
    `;
    const { rows } = await pool.query(query);
    const totalBruto = Number(rows[0].total_bruto);
    
    // Calcula 10% do valor bruto
    const receitaPlataforma = totalBruto * 0.10;
    
    return receitaPlataforma;
  } catch (error) {
    console.error('Erro ao calcular receita:', error.message);
    throw error;
  }
}

/**
 * 9. Obter Estatísticas do Gestor
 * Calcula a receita de hoje, número de reservas e jogadores esperados para as quadras do gestor
 */
async function obterEstatisticasGestor(managerId) {
  try {
    // 1. Soma o valor da hora de todas as partidas agendadas/confirmadas para HOJE nas quadras deste gestor
    const queryReceita = `
      SELECT COALESCE(SUM(c.hour_value), 0) AS receita_hoje
      FROM match m
      INNER JOIN court c ON m.court_id = c.id
      INNER JOIN sport_complex sc ON c.complex_id = sc.id
      WHERE sc.manager_id = $1 AND m.date = CURRENT_DATE AND UPPER(m.status) != 'CANCELADA';
    `;

    // 2. Conta quantas partidas no total existem para HOJE nas quadras deste gestor
    const queryReservas = `
      SELECT COUNT(*) AS total_reservas
      FROM match m
      INNER JOIN court c ON m.court_id = c.id
      INNER JOIN sport_complex sc ON c.complex_id = sc.id
      WHERE sc.manager_id = $1 AND m.date = CURRENT_DATE;
    `;

    // 3. Conta quantos jogadores confirmaram presença nas partidas de HOJE deste gestor
    const queryJogadores = `
      SELECT COUNT(p.user_id) AS total_jogadores
      FROM participation p
      INNER JOIN match m ON p.match_id = m.id
      INNER JOIN court c ON m.court_id = c.id
      INNER JOIN sport_complex sc ON c.complex_id = sc.id
      WHERE sc.manager_id = $1 AND m.date = CURRENT_DATE;
    `;

    const resReceita = await pool.query(queryReceita, [managerId]);
    const resReservas = await pool.query(queryReservas, [managerId]);
    const resJogadores = await pool.query(queryJogadores, [managerId]);

    return {
      receitaHoje: Number(resReceita.rows[0].receita_hoje),
      reservasHoje: Number(resReservas.rows[0].total_reservas),
      jogadoresHoje: Number(resJogadores.rows[0].total_jogadores)
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas do gestor:', error.message);
    throw error;
  }
}

/**
 * 10. Listar Partidas do Gestor
 * Retorna as partidas agendadas para as quadras de um gestor específico
 */
async function listarPartidasDoGestor(managerId) {
  try {
    const query = `
      SELECT
        m.id,
        m.date,
        m.status,
        m.court_id,
        c.name AS court_name,
        c.type AS court_type,
        sc.name AS complex_name
      FROM match m
      INNER JOIN court c ON m.court_id = c.id
      INNER JOIN sport_complex sc ON c.complex_id = sc.id
      WHERE sc.manager_id = $1
      ORDER BY m.date ASC;
    `;
    const { rows } = await pool.query(query, [managerId]);
    return rows;
  } catch (error) {
    console.error('Erro ao listar partidas do gestor:', error.message);
    throw error;
  }
}

// Exporte as funções para usar em suas rotas (ex: Express.js)
module.exports = {
  ensureAuthSchema,
  getUserById,
  listarUsuarios,
  atualizarRoleUsuario,
  validarLogin,
  criarPartida,
  criarQuadra,
  criarComplexoEQuadra,
  participarPartida,
  removerParticipacao,
  listarTodasPartidas,
  listarPartidasDoUsuario,
  listarQuadras,
  registerUser,
  obterReceitaPlataforma,
  obterEstatisticasGestor,
  listarPartidasDoGestor
}