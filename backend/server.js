const express = require('express');
const cors = require('cors');
// Importa as funções do arquivo que você mandou (supondo que o nome seja database.js)
const db = require('./database'); 

const app = express();
const PORT = 3333;

// Middleware obrigatório
app.use(cors());
app.use(express.json()); // Permite que o servidor entenda JSON enviado pelo React

async function requireUserRole(userId, allowedRoles) {
  const usuario = await db.getUserById(userId);

  if (!usuario) {
    const error = new Error('Usuário não encontrado.');
    error.statusCode = 404;
    throw error;
  }

  if (!allowedRoles.includes(usuario.role)) {
    const error = new Error('Permissão negada.');
    error.statusCode = 403;
    throw error;
  }

  return usuario;
}

// ================= ROTAS DO BANCO DE DADOS =================

// 1. Rota de Cadastro de Usuário
app.post('/api/cadastro', async (req, res) => {
  try {
    const { nome, username, email, cpf, senha, dataNasc, type, profileData } = req.body;
    
    // Mapeia os dados do formato do React para o formato esperado pela sua função
    const userData = {
      name: nome,
      username: username || email.split('@')[0], // Fallback caso não envie username
      email: email,
      cpf: cpf,
      password: senha,
      birthday: dataNasc
    };

    const userId = await db.registerUser(userData, type || 'player', profileData || {});
    
    res.status(201).json({ sucesso: true, userId, mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: error.message });
  }
});

// 2. Rota de Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const resultado = await db.validarLogin(email, password);
    
    if (resultado.sucesso) {
      res.status(200).json(resultado);
    } else {
      res.status(401).json(resultado);
    }
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: error.message });
  }
});

app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await db.listarUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: error.message });
  }
});

app.patch('/api/usuarios/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, requesterId } = req.body;

    if (!requesterId) {
      return res.status(400).json({ sucesso: false, mensagem: 'requesterId é obrigatório.' });
    }

    await requireUserRole(requesterId, ['admin']);

    const usuarioAtualizado = await db.atualizarRoleUsuario(userId, role);
    res.status(200).json({ sucesso: true, usuario: usuarioAtualizado });
  } catch (error) {
    res.status(error.statusCode || 500).json({ sucesso: false, mensagem: error.message });
  }
});

// 3. Rota para Participar de Partida
app.post('/api/partidas/participar', async (req, res) => {
  try {
    const { matchId, userId, quotaValue } = req.body;
    const participacao = await db.participarPartida(matchId, userId, quotaValue);
    res.status(201).json({ sucesso: true, data: participacao });
  } catch (error) {
    res.status(400).json({ sucesso: false, mensagem: error.message });
  }
});

// 4. Rota para Remover Participação
app.delete('/api/partidas/remover', async (req, res) => {
  try {
    const { matchId, userId } = req.body;
    const removido = await db.removerParticipacao(matchId, userId);
    if (removido) {
      res.status(200).json({ sucesso: true, mensagem: 'Participação removida!' });
    } else {
      res.status(404).json({ sucesso: false, mensagem: 'Participação não encontrada.' });
    }
  } catch (error) {
    res.status(500).json({ sucesso: false, message: error.message });
  }
});

// 5. Rota para Listar Partidas Ativas de um Usuário
app.get('/api/usuarios/:userId/partidas', async (req, res) => {
  try {
    const { userId } = req.params;
    const partidas = await db.listarPartidasDoUsuario(userId);
    res.status(200).json(partidas);
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: error.message });
  }
});

app.get('/api/quadras', async (req, res) => {
  try {
    const quadras = await db.listarQuadras();
    res.status(200).json(quadras);
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: error.message });
  }
});

app.post('/api/quadras', async (req, res) => {
  try {
    const {
      requesterId,
      complexName,
      street,
      number,
      city,
      state,
      cep,
      cnpj,
      courtName,
      type,
      hourValue,
    } = req.body;

    if (!requesterId) {
      return res.status(400).json({ sucesso: false, mensagem: 'requesterId é obrigatório.' });
    }

    const usuario = await requireUserRole(requesterId, ['admin', 'manager']);

    if (!complexName || !courtName || type === undefined || hourValue === undefined) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'complexName, courtName, type e hourValue são obrigatórios.',
      });
    }

    const quadra = await db.criarComplexoEQuadra({
      managerId: usuario.role === 'manager' ? usuario.id : null,
      complexName,
      street,
      number,
      city,
      state,
      cep,
      cnpj,
      courtName,
      type: Number(type),
      hourValue: Number(hourValue),
    });

    res.status(201).json({ sucesso: true, data: quadra });
  } catch (error) {
    res.status(error.statusCode || 500).json({ sucesso: false, mensagem: error.message });
  }
});

app.post('/api/partidas', async (req, res) => {
  try {
    const { courtId, date, status } = req.body;

    if (!courtId || !date) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'courtId e date são obrigatórios para criar a partida.',
      });
    }

    const partida = await db.criarPartida(courtId, date, status || 'agendada');
    res.status(201).json({ sucesso: true, data: partida });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: error.message });
  }
});

app.get('/partidas', async (req, res) => {
  try {
    // Chama a função que vai no banco de dados
    const partidas = await db.listarTodasPartidas();

    // Retorna o resultado em formato JSON com status 200 (OK)
    return res.status(200).json(partidas);

  } catch (error) {
    // Se der erro no banco, retorna um JSON com a mensagem de erro e status 500
    return res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro interno no servidor ao buscar as partidas.',
      erro: error.message 
    });
  }
});

// Rota para buscar as estatísticas gerais do painel
app.get('/api/estatisticas', async (req, res) => {
  try {
    const receita = await db.obterReceitaPlataforma();
    res.status(200).json({ sucesso: true, receita });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: error.message });
  }
});

// Rota para buscar as estatísticas exclusivas de um gestor específico
app.get('/api/gestores/:managerId/estatisticas', async (req, res) => {
  try {
    const { managerId } = req.params;
    const stats = await db.obterEstatisticasGestor(managerId);
    res.status(200).json({ sucesso: true, ...stats });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: error.message });
  }
});

// Rota para buscar os próximos jogos nas quadras do gestor
app.get('/api/gestores/:managerId/partidas', async (req, res) => {
  try {
    const { managerId } = req.params;
    const partidas = await db.listarPartidasDoGestor(managerId);
    res.status(200).json({ sucesso: true, partidas });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: error.message });
  }
});

async function startServer() {
  await db.ensureAuthSchema();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Falha ao inicializar o backend:', error.message);
  process.exit(1);
});