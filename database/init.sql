-- Database PostgreSQL per Sistema di Gestione Sinistri Assicurativi
-- Versione con tabelle tipologiche

-- ===============================
-- TABELLE TIPOLOGICHE (LOOKUP)
-- ===============================

-- Tipologie di polizza
CREATE TABLE tipo_polizza (
                              id_tipo_polizza SERIAL PRIMARY KEY,
                              codice VARCHAR(10) UNIQUE NOT NULL,
                              descrizione VARCHAR(50) NOT NULL,
                              attivo BOOLEAN DEFAULT TRUE,
                              ordinamento INTEGER DEFAULT 0
);

-- Stati delle polizze
CREATE TABLE stato_polizza (
                               id_stato_polizza SERIAL PRIMARY KEY,
                               codice VARCHAR(10) UNIQUE NOT NULL,
                               descrizione VARCHAR(50) NOT NULL,
                               attivo BOOLEAN DEFAULT TRUE,
                               ordinamento INTEGER DEFAULT 0
);

-- Tipologie di sinistro
CREATE TABLE tipo_sinistro (
                               id_tipo_sinistro SERIAL PRIMARY KEY,
                               codice VARCHAR(20) UNIQUE NOT NULL,
                               descrizione VARCHAR(100) NOT NULL,
                               attivo BOOLEAN DEFAULT TRUE,
                               ordinamento INTEGER DEFAULT 0
);

-- Stati dei sinistri
CREATE TABLE stato_sinistro (
                                id_stato_sinistro SERIAL PRIMARY KEY,
                                codice VARCHAR(15) UNIQUE NOT NULL,
                                descrizione VARCHAR(50) NOT NULL,
                                attivo BOOLEAN DEFAULT TRUE,
                                ordinamento INTEGER DEFAULT 0,
                                colore VARCHAR(7) -- per interfaccia grafica (es. #FF0000)
);

-- Ruoli degli operatori
CREATE TABLE ruolo_operatore (
                                 id_ruolo_operatore SERIAL PRIMARY KEY,
                                 codice VARCHAR(15) UNIQUE NOT NULL,
                                 descrizione VARCHAR(50) NOT NULL,
                                 livello_autorizzazione INTEGER DEFAULT 1, -- per gestire permessi
                                 attivo BOOLEAN DEFAULT TRUE,
                                 ordinamento INTEGER DEFAULT 0
);

-- Tipologie di perizia
CREATE TABLE tipo_perizia (
                              id_tipo_perizia SERIAL PRIMARY KEY,
                              codice VARCHAR(20) UNIQUE NOT NULL,
                              descrizione VARCHAR(100) NOT NULL,
                              attivo BOOLEAN DEFAULT TRUE,
                              ordinamento INTEGER DEFAULT 0
);

-- Esiti delle perizie
CREATE TABLE esito_perizia (
                               id_esito_perizia SERIAL PRIMARY KEY,
                               codice VARCHAR(20) UNIQUE NOT NULL,
                               descrizione VARCHAR(50) NOT NULL,
                               favorevole BOOLEAN, -- indica se l'esito è favorevole o meno
                               attivo BOOLEAN DEFAULT TRUE,
                               ordinamento INTEGER DEFAULT 0
);

-- Tipologie di pagamento
CREATE TABLE tipo_pagamento (
                                id_tipo_pagamento SERIAL PRIMARY KEY,
                                codice VARCHAR(20) UNIQUE NOT NULL,
                                descrizione VARCHAR(100) NOT NULL,
                                attivo BOOLEAN DEFAULT TRUE,
                                ordinamento INTEGER DEFAULT 0
);

-- Modalità di pagamento
CREATE TABLE modalita_pagamento (
                                    id_modalita_pagamento SERIAL PRIMARY KEY,
                                    codice VARCHAR(15) UNIQUE NOT NULL,
                                    descrizione VARCHAR(50) NOT NULL,
                                    richiede_riferimento BOOLEAN DEFAULT FALSE, -- se richiede numero transazione
                                    attivo BOOLEAN DEFAULT TRUE,
                                    ordinamento INTEGER DEFAULT 0
);

-- Tipologie di attività per cronologia
CREATE TABLE tipo_attivita (
                               id_tipo_attivita SERIAL PRIMARY KEY,
                               codice VARCHAR(15) UNIQUE NOT NULL,
                               descrizione VARCHAR(50) NOT NULL,
                               attivo BOOLEAN DEFAULT TRUE,
                               ordinamento INTEGER DEFAULT 0
);

-- ===============================
-- TABELLE PRINCIPALI
-- ===============================

-- Tabella degli assicurati
CREATE TABLE assicurati (
                            id_assicurato SERIAL PRIMARY KEY,
                            codice_fiscale VARCHAR(16) UNIQUE NOT NULL,
                            nome VARCHAR(50) NOT NULL,
                            cognome VARCHAR(50) NOT NULL,
                            data_nascita DATE NOT NULL,
                            indirizzo VARCHAR(100),
                            cap VARCHAR(5),
                            citta VARCHAR(50),
                            provincia VARCHAR(2),
                            telefono VARCHAR(20),
                            email VARCHAR(100),
                            data_registrazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            attivo BOOLEAN DEFAULT TRUE
);

-- Tabella delle polizze
CREATE TABLE polizze (
                         id_polizza SERIAL PRIMARY KEY,
                         numero_polizza VARCHAR(20) UNIQUE NOT NULL,
                         id_assicurato INTEGER NOT NULL,
                         id_tipo_polizza INTEGER NOT NULL,
                         data_inizio DATE NOT NULL,
                         data_scadenza DATE NOT NULL,
                         premio_annuale DECIMAL(10,2) NOT NULL,
                         id_stato_polizza INTEGER NOT NULL,
                         massimale DECIMAL(12,2),
                         franchigia DECIMAL(8,2) DEFAULT 0,
                         data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         data_modifica TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT fk_polizze_assicurato FOREIGN KEY (id_assicurato) REFERENCES assicurati(id_assicurato),
                         CONSTRAINT fk_polizze_tipo_polizza FOREIGN KEY (id_tipo_polizza) REFERENCES tipo_polizza(id_tipo_polizza),
                         CONSTRAINT fk_polizze_stato_polizza FOREIGN KEY (id_stato_polizza) REFERENCES stato_polizza(id_stato_polizza)
);

-- Tabella degli operatori/periti
CREATE TABLE operatori (
                           id_operatore SERIAL PRIMARY KEY,
                           codice_operatore VARCHAR(10) UNIQUE NOT NULL,
                           nome VARCHAR(50) NOT NULL,
                           cognome VARCHAR(50) NOT NULL,
                           id_ruolo_operatore INTEGER NOT NULL,
                           telefono VARCHAR(20),
                           email VARCHAR(100) NOT NULL,
                           data_assunzione DATE,
                           data_cessazione DATE,
                           attivo BOOLEAN DEFAULT TRUE,
                           CONSTRAINT fk_operatori_ruolo FOREIGN KEY (id_ruolo_operatore) REFERENCES ruolo_operatore(id_ruolo_operatore)
);

-- Tabella dei sinistri
CREATE TABLE sinistri (
                          id_sinistro SERIAL PRIMARY KEY,
                          numero_sinistro VARCHAR(20) UNIQUE NOT NULL,
                          id_polizza INTEGER NOT NULL,
                          data_sinistro DATE NOT NULL,
                          data_denuncia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          luogo_sinistro VARCHAR(200),
                          descrizione TEXT NOT NULL,
                          id_tipo_sinistro INTEGER NOT NULL,
                          id_stato_sinistro INTEGER NOT NULL,
                          importo_richiesto DECIMAL(10,2),
                          importo_liquidato DECIMAL(10,2),
                          data_chiusura DATE,
                          note TEXT,
                          id_operatore_assegnato INTEGER, -- operatore principale del caso
                          priorita INTEGER DEFAULT 3, -- 1=alta, 2=media, 3=bassa
                          data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          data_modifica TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT fk_sinistri_polizza FOREIGN KEY (id_polizza) REFERENCES polizze(id_polizza),
                          CONSTRAINT fk_sinistri_tipo_sinistro FOREIGN KEY (id_tipo_sinistro) REFERENCES tipo_sinistro(id_tipo_sinistro),
                          CONSTRAINT fk_sinistri_stato_sinistro FOREIGN KEY (id_stato_sinistro) REFERENCES stato_sinistro(id_stato_sinistro),
                          CONSTRAINT fk_sinistri_operatore FOREIGN KEY (id_operatore_assegnato) REFERENCES operatori(id_operatore)
);

-- Tabella delle perizie/valutazioni
CREATE TABLE perizie (
                         id_perizia SERIAL PRIMARY KEY,
                         id_sinistro INTEGER NOT NULL,
                         id_operatore INTEGER NOT NULL,
                         data_perizia DATE NOT NULL,
                         id_tipo_perizia INTEGER NOT NULL,
                         id_esito_perizia INTEGER NOT NULL,
                         importo_stimato DECIMAL(10,2),
                         relazione TEXT,
                         allegati VARCHAR(500), -- path dei file allegati
                         data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT fk_perizie_sinistro FOREIGN KEY (id_sinistro) REFERENCES sinistri(id_sinistro),
                         CONSTRAINT fk_perizie_operatore FOREIGN KEY (id_operatore) REFERENCES operatori(id_operatore),
                         CONSTRAINT fk_perizie_tipo_perizia FOREIGN KEY (id_tipo_perizia) REFERENCES tipo_perizia(id_tipo_perizia),
                         CONSTRAINT fk_perizie_esito_perizia FOREIGN KEY (id_esito_perizia) REFERENCES esito_perizia(id_esito_perizia)
);

-- Tabella dei pagamenti/liquidazioni
CREATE TABLE pagamenti (
                           id_pagamento SERIAL PRIMARY KEY,
                           id_sinistro INTEGER NOT NULL,
                           data_pagamento DATE NOT NULL,
                           importo DECIMAL(10,2) NOT NULL,
                           id_tipo_pagamento INTEGER NOT NULL,
                           id_modalita_pagamento INTEGER NOT NULL,
                           numero_transazione VARCHAR(50),
                           note VARCHAR(200),
                           data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           CONSTRAINT fk_pagamenti_sinistro FOREIGN KEY (id_sinistro) REFERENCES sinistri(id_sinistro),
                           CONSTRAINT fk_pagamenti_tipo_pagamento FOREIGN KEY (id_tipo_pagamento) REFERENCES tipo_pagamento(id_tipo_pagamento),
                           CONSTRAINT fk_pagamenti_modalita_pagamento FOREIGN KEY (id_modalita_pagamento) REFERENCES modalita_pagamento(id_modalita_pagamento)
);

-- Tabella per i movimenti/log delle attività
CREATE TABLE movimento_sinistri (
                                    id_movimento SERIAL PRIMARY KEY,
                                    id_sinistro INTEGER NOT NULL,
                                    id_operatore INTEGER,
                                    data_attivita TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    id_tipo_attivita INTEGER NOT NULL,
                                    descrizione TEXT NOT NULL,
                                    stato_precedente VARCHAR(20),
                                    stato_nuovo VARCHAR(20),
                                    CONSTRAINT fk_movimento_sinistro FOREIGN KEY (id_sinistro) REFERENCES sinistri(id_sinistro),
                                    CONSTRAINT fk_movimento_operatore FOREIGN KEY (id_operatore) REFERENCES operatori(id_operatore),
                                    CONSTRAINT fk_movimento_tipo_attivita FOREIGN KEY (id_tipo_attivita) REFERENCES tipo_attivita(id_tipo_attivita)
);

-- ===============================
-- POPOLAMENTO TABELLE TIPOLOGICHE
-- ===============================

-- Popolamento tipo_polizza
INSERT INTO tipo_polizza (codice, descrizione, ordinamento) VALUES
                                                                ('AUTO', 'Polizza Auto', 1),
                                                                ('CASA', 'Polizza Casa', 2),
                                                                ('VITA', 'Polizza Vita', 3),
                                                                ('SALUTE', 'Polizza Salute', 4),
                                                                ('RC', 'Responsabilità Civile', 5);

-- Popolamento stato_polizza
INSERT INTO stato_polizza (codice, descrizione, ordinamento) VALUES
                                                                 ('ATTIVA', 'Attiva', 1),
                                                                 ('SOSPESA', 'Sospesa', 2),
                                                                 ('SCADUTA', 'Scaduta', 3),
                                                                 ('ANNULLATA', 'Annullata', 4);

-- Popolamento tipo_sinistro
INSERT INTO tipo_sinistro (codice, descrizione, ordinamento) VALUES
                                                                 ('INC_STRADALE', 'Incidente Stradale', 1),
                                                                 ('FURTO', 'Furto', 2),
                                                                 ('INCENDIO', 'Incendio', 3),
                                                                 ('DANNI_ACQUA', 'Danni da Acqua', 4),
                                                                 ('RC', 'Responsabilità Civile', 5),
                                                                 ('ALTRO', 'Altro', 99);

-- Popolamento stato_sinistro
INSERT INTO stato_sinistro (codice, descrizione, ordinamento, colore) VALUES
                                                                          ('APERTO', 'Aperto', 1, '#FF6B6B'),
                                                                          ('IN_VALUTAZIONE', 'In Valutazione', 2, '#4ECDC4'),
                                                                          ('CHIUSO', 'Chiuso', 3, '#45B7D1'),
                                                                          ('RESPINTO', 'Respinto', 4, '#96CEB4'),
                                                                          ('SOSPESO', 'Sospeso', 5, '#FECA57');

-- Popolamento ruolo_operatore
INSERT INTO ruolo_operatore (codice, descrizione, livello_autorizzazione, ordinamento) VALUES
                                                                                           ('PERITO', 'Perito', 2, 1),
                                                                                           ('LIQUIDATORE', 'Liquidatore', 3, 2),
                                                                                           ('ISPETTORE', 'Ispettore', 2, 3),
                                                                                           ('MANAGER', 'Manager', 4, 4);

-- Popolamento tipo_perizia
INSERT INTO tipo_perizia (codice, descrizione, ordinamento) VALUES
                                                                ('VAL_DANNI', 'Valutazione Danni', 1),
                                                                ('SOPRALLUOGO', 'Sopralluogo', 2),
                                                                ('PER_MEDICA', 'Perizia Medica', 3),
                                                                ('STIMA_RIP', 'Stima Riparazione', 4);

-- Popolamento esito_perizia
INSERT INTO esito_perizia (codice, descrizione, favorevole, ordinamento) VALUES
                                                                             ('FAVOREVOLE', 'Favorevole', TRUE, 1),
                                                                             ('PARZ_FAVOR', 'Parzialmente Favorevole', TRUE, 2),
                                                                             ('SFAVOREVOLE', 'Sfavorevole', FALSE, 3),
                                                                             ('DA_APPROF', 'Da Approfondire', NULL, 4);

-- Popolamento tipo_pagamento
INSERT INTO tipo_pagamento (codice, descrizione, ordinamento) VALUES
                                                                  ('LIQ_TOTALE', 'Liquidazione Totale', 1),
                                                                  ('ACCONTO', 'Acconto', 2),
                                                                  ('RIMB_SPESE', 'Rimborso Spese', 3),
                                                                  ('IND_PARZIALE', 'Indennizzo Parziale', 4);

-- Popolamento modalita_pagamento
INSERT INTO modalita_pagamento (codice, descrizione, richiede_riferimento, ordinamento) VALUES
                                                                                            ('BONIFICO', 'Bonifico Bancario', TRUE, 1),
                                                                                            ('ASSEGNO', 'Assegno', FALSE, 2),
                                                                                            ('CONTANTI', 'Contanti', FALSE, 3);

-- Popolamento tipo_attivita
INSERT INTO tipo_attivita (codice, descrizione, ordinamento) VALUES
                                                                 ('APERTURA', 'Apertura', 1),
                                                                 ('ASSEGNAZIONE', 'Assegnazione', 2),
                                                                 ('PERIZIA', 'Perizia', 3),
                                                                 ('PAGAMENTO', 'Pagamento', 4),
                                                                 ('CHIUSURA', 'Chiusura', 5),
                                                                 ('SOSPENSIONE', 'Sospensione', 6),
                                                                 ('RIATTIVAZIONE', 'Riattivazione', 7);

-- ===============================
-- INDICI PER PERFORMANCE
-- ===============================

-- Indici su tabelle principali
CREATE INDEX idx_sinistri_data ON sinistri(data_sinistro);
CREATE INDEX idx_sinistri_stato ON sinistri(id_stato_sinistro);
CREATE INDEX idx_sinistri_tipo ON sinistri(id_tipo_sinistro);
CREATE INDEX idx_polizze_assicurato ON polizze(id_assicurato);
CREATE INDEX idx_polizze_stato ON polizze(id_stato_polizza);
CREATE INDEX idx_perizie_sinistro ON perizie(id_sinistro);
CREATE INDEX idx_movimento_sinistro ON movimento_sinistri(id_sinistro);
CREATE INDEX idx_movimento_data ON movimento_sinistri(data_attivita);

-- Indici su codici delle tabelle tipologiche
CREATE INDEX idx_tipo_polizza_codice ON tipo_polizza(codice);
CREATE INDEX idx_stato_polizza_codice ON stato_polizza(codice);
CREATE INDEX idx_tipo_sinistro_codice ON tipo_sinistro(codice);
CREATE INDEX idx_stato_sinistro_codice ON stato_sinistro(codice);