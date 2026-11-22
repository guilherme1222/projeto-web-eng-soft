-- ===========================================================================
-- 1. USERS (10 Usuários: 5 serão Gestores e 5 serão Jogadores)
-- ===========================================================================
-- Gestores
INSERT INTO users (id, name, username, email, cpf, password, birthday, user_created_date) VALUES
                                                                                              ('11111111-1111-1111-1111-111111111111', 'Carlos Silva', 'carlos_gestor', 'carlos@email.com', '10000000001', 'hash123', '1980-01-10', CURRENT_TIMESTAMP),
                                                                                              ('11111111-1111-1111-1111-222222222222', 'Ana Paula', 'ana_arena', 'ana@email.com', '10000000002', 'hash123', '1985-02-15', CURRENT_TIMESTAMP),
                                                                                              ('11111111-1111-1111-1111-333333333333', 'Roberto Rocha', 'beto_quadras', 'roberto@email.com', '10000000003', 'hash123', '1979-05-20', CURRENT_TIMESTAMP),
                                                                                              ('11111111-1111-1111-1111-444444444444', 'Fernanda Lima', 'nanda_sports', 'nanda@email.com', '10000000004', 'hash123', '1990-08-30', CURRENT_TIMESTAMP),
                                                                                              ('11111111-1111-1111-1111-555555555555', 'Marcos Dias', 'marcos_clube', 'marcos@email.com', '10000000005', 'hash123', '1982-11-11', CURRENT_TIMESTAMP);

-- Jogadores
INSERT INTO users (id, name, username, email, cpf, password, birthday, user_created_date) VALUES
                                                                                              ('22222222-2222-2222-2222-111111111111', 'João Atleta', 'joao_craque', 'joao@email.com', '20000000001', 'hash456', '1995-04-12', CURRENT_TIMESTAMP),
                                                                                              ('22222222-2222-2222-2222-222222222222', 'Maria Volei', 'maria_saque', 'maria@email.com', '20000000002', 'hash456', '1998-07-22', CURRENT_TIMESTAMP),
                                                                                              ('22222222-2222-2222-2222-333333333333', 'Pedro Basquete', 'pedro_dunk', 'pedro@email.com', '20000000003', 'hash456', '1993-09-05', CURRENT_TIMESTAMP),
                                                                                              ('22222222-2222-2222-2222-444444444444', 'Lucas Tenis', 'lucas_ace', 'lucas@email.com', '20000000004', 'hash456', '2000-12-10', CURRENT_TIMESTAMP),
                                                                                              ('22222222-2222-2222-2222-555555555555', 'Julia Fut', 'ju_artilheira', 'julia@email.com', '20000000005', 'hash456', '1997-03-25', CURRENT_TIMESTAMP);


-- ===========================================================================
-- 2. MANAGER (5 Linhas)
-- ===========================================================================
INSERT INTO manager (user_id, cnpj, chave_pix) VALUES
                                                   ('11111111-1111-1111-1111-111111111111', '11.111.111/0001-11', 'carlos@pix.com'),
                                                   ('11111111-1111-1111-1111-222222222222', '22.222.222/0001-22', 'ana@pix.com'),
                                                   ('11111111-1111-1111-1111-333333333333', '33.333.333/0001-33', 'roberto@pix.com'),
                                                   ('11111111-1111-1111-1111-444444444444', '44.444.444/0001-44', 'nanda@pix.com'),
                                                   ('11111111-1111-1111-1111-555555555555', '55.555.555/0001-55', 'marcos@pix.com');


-- ===========================================================================
-- 3. PLAYERS (5 Linhas)
-- ===========================================================================
INSERT INTO players (user_id, media_desempenho, total_partidas_avaliadas) VALUES
                                                                              ('22222222-2222-2222-2222-111111111111', 8.5, 10),
                                                                              ('22222222-2222-2222-2222-222222222222', 9.2, 15),
                                                                              ('22222222-2222-2222-2222-333333333333', 7.8, 8),
                                                                              ('22222222-2222-2222-2222-444444444444', 8.9, 12),
                                                                              ('22222222-2222-2222-2222-555555555555', 9.5, 20);


-- ===========================================================================
-- 4. SPORT_COMPLEX (5 Linhas - 1 para cada gestor)
-- ===========================================================================
INSERT INTO sport_complex (id, name, cnpj, cep, state, city, street, number, manager_id) VALUES
                                                                                             ('aaaa1111-aaaa-aaaa-aaaa-111111111111', 'Complexo Central', '11.111.111/0001-11', '30000-001', 'MG', 'BH', 'Rua A', 10, '11111111-1111-1111-1111-111111111111'),
                                                                                             ('aaaa1111-aaaa-aaaa-aaaa-222222222222', 'Arena Sul', '22.222.222/0001-22', '30000-002', 'MG', 'BH', 'Rua B', 20, '11111111-1111-1111-1111-222222222222'),
                                                                                             ('aaaa1111-aaaa-aaaa-aaaa-333333333333', 'Clube Norte', '33.333.333/0001-33', '30000-003', 'MG', 'BH', 'Rua C', 30, '11111111-1111-1111-1111-333333333333'),
                                                                                             ('aaaa1111-aaaa-aaaa-aaaa-444444444444', 'Vila Esportiva', '44.444.444/0001-44', '30000-004', 'MG', 'BH', 'Rua D', 40, '11111111-1111-1111-1111-444444444444'),
                                                                                             ('aaaa1111-aaaa-aaaa-aaaa-555555555555', 'Polo Aquático e Quadras', '55.555.555/0001-55', '30000-005', 'MG', 'BH', 'Rua E', 50, '11111111-1111-1111-1111-555555555555');


-- ===========================================================================
-- 5. COURT (5 Linhas - O tipo DEVE ser entre 0 e 3 conforme seu SQL)
-- ===========================================================================
INSERT INTO court (id, name, type, hour_value, complex_id) VALUES
                                                               ('bbbb1111-bbbb-bbbb-bbbb-111111111111', 'Quadra Society 1', 1, 150.00, 'aaaa1111-aaaa-aaaa-aaaa-111111111111'),
                                                               ('bbbb1111-bbbb-bbbb-bbbb-222222222222', 'Quadra Areia', 2, 100.00, 'aaaa1111-aaaa-aaaa-aaaa-222222222222'),
                                                               ('bbbb1111-bbbb-bbbb-bbbb-333333333333', 'Ginásio', 0, 200.00, 'aaaa1111-aaaa-aaaa-aaaa-333333333333'),
                                                               ('bbbb1111-bbbb-bbbb-bbbb-444444444444', 'Quadra Futsal', 3, 180.00, 'aaaa1111-aaaa-aaaa-aaaa-444444444444'),
                                                               ('bbbb1111-bbbb-bbbb-bbbb-555555555555', 'Quadra Futsal Principal', 0, 120.00, 'aaaa1111-aaaa-aaaa-aaaa-555555555555');


-- ===========================================================================
-- 6. MATCH (5 Linhas - 1 em cada quadra)
-- ===========================================================================
INSERT INTO match (organizador_id, id, status, date, match_create_date, court_id) VALUES
                                                                                      ('11111111-1111-1111-1111-111111111111','cccc1111-cccc-cccc-cccc-111111111111', 'FINALIZADA', '2024-05-10', CURRENT_TIMESTAMP, 'bbbb1111-bbbb-bbbb-bbbb-111111111111'),
                                                                                      ('11111111-1111-1111-1111-222222222222','cccc1111-cccc-cccc-cccc-222222222222', 'AGENDADA',   '2024-06-15', CURRENT_TIMESTAMP, 'bbbb1111-bbbb-bbbb-bbbb-222222222222'),
                                                                                      ('11111111-1111-1111-1111-111111111111','cccc1111-cccc-cccc-cccc-333333333333', 'FINALIZADA', '2024-05-12', CURRENT_TIMESTAMP, 'bbbb1111-bbbb-bbbb-bbbb-333333333333'),
                                                                                      ('11111111-1111-1111-1111-333333333333','cccc1111-cccc-cccc-cccc-444444444444', 'CANCELADA',  '2024-05-20', CURRENT_TIMESTAMP, 'bbbb1111-bbbb-bbbb-bbbb-444444444444'),
                                                                                      ('11111111-1111-1111-1111-444444444444','cccc1111-cccc-cccc-cccc-555555555555', 'FINALIZADA', '2024-05-05', CURRENT_TIMESTAMP, 'bbbb1111-bbbb-bbbb-bbbb-555555555555');


-- ===========================================================================
-- 7. PARTICIPATION (10 Linhas - 2 Jogadores em cada Partida)
-- ===========================================================================
INSERT INTO participation (match_id, user_id, quota_value, payment_status) VALUES
-- Partida 1: João e Maria
('cccc1111-cccc-cccc-cccc-111111111111', '22222222-2222-2222-2222-111111111111', '75.00', 'PAGO'),
('cccc1111-cccc-cccc-cccc-111111111111', '22222222-2222-2222-2222-222222222222', '75.00', 'PAGO'),

-- Partida 2: Pedro e Lucas
('cccc1111-cccc-cccc-cccc-222222222222', '22222222-2222-2222-2222-333333333333', '50.00', 'PENDENTE'),
('cccc1111-cccc-cccc-cccc-222222222222', '22222222-2222-2222-2222-444444444444', '50.00', 'PAGO'),

-- Partida 3: Julia e João
('cccc1111-cccc-cccc-cccc-333333333333', '22222222-2222-2222-2222-555555555555', '100.00', 'PAGO'),
('cccc1111-cccc-cccc-cccc-333333333333', '22222222-2222-2222-2222-111111111111', '100.00', 'PAGO'),

-- Partida 4: Maria e Pedro
('cccc1111-cccc-cccc-cccc-444444444444', '22222222-2222-2222-2222-222222222222', '90.00', 'ESTORNADO'),
('cccc1111-cccc-cccc-cccc-444444444444', '22222222-2222-2222-2222-333333333333', '90.00', 'ESTORNADO'),

-- Partida 5: Lucas e Julia
('cccc1111-cccc-cccc-cccc-555555555555', '22222222-2222-2222-2222-444444444444', '60.00', 'PAGO'),
('cccc1111-cccc-cccc-cccc-555555555555', '22222222-2222-2222-2222-555555555555', '60.00', 'PAGO');


-- ===========================================================================
-- 8. AVALIACAO (6 Linhas - Baseadas nos jogadores que estiveram juntos)
-- ===========================================================================
INSERT INTO avaliacao (match_id, avaliador_id, avaliado_id, nota, comentario, data_avaliacao) VALUES
-- Partida 1: Avaliações cruzadas entre João(111) e Maria(222)
('cccc1111-cccc-cccc-cccc-111111111111', '22222222-2222-2222-2222-111111111111', '22222222-2222-2222-2222-222222222222', 4.5, 'Jogou muito bem!', CURRENT_TIMESTAMP),
('cccc1111-cccc-cccc-cccc-111111111111', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-111111111111', 5.0, 'Excelente parceiro de time.', CURRENT_TIMESTAMP),

-- Partida 3: Julia(555) avalia o João(111)
('cccc1111-cccc-cccc-cccc-333333333333', '22222222-2222-2222-2222-555555555555', '22222222-2222-2222-2222-111111111111', 3.5, 'Chegou atrasado, mas compensou.', CURRENT_TIMESTAMP),
('cccc1111-cccc-cccc-cccc-333333333333', '22222222-2222-2222-2222-111111111111', '22222222-2222-2222-2222-555555555555', 4.0, 'Bons passes.', CURRENT_TIMESTAMP),

-- Partida 5: Lucas(444) e Julia(555) se avaliam
('cccc1111-cccc-cccc-cccc-555555555555', '22222222-2222-2222-2222-444444444444', '22222222-2222-2222-2222-555555555555', 5.0, 'Defendeu tudo!', CURRENT_TIMESTAMP),
('cccc1111-cccc-cccc-cccc-555555555555', '22222222-2222-2222-2222-555555555555', '22222222-2222-2222-2222-444444444444', 4.5, 'Saque muito forte.', CURRENT_TIMESTAMP);
