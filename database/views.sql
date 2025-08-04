-- ===============================
-- VIEWS PER GESTIONE SINISTRI
-- ===============================

-- Vista per gli assicurati con informazioni aggregate
CREATE VIEW v_assicurati AS
SELECT 
    a.id_assicurato,
    a.codice_fiscale,
    a.nome,
    a.cognome,
    CONCAT(a.nome, ' ', a.cognome) AS nome_completo,
    a.data_nascita,
    EXTRACT(YEAR FROM AGE(a.data_nascita)) AS eta,
    a.indirizzo,
    a.cap,
    a.citta,
    a.provincia,
    CONCAT(a.indirizzo, ', ', a.cap, ' ', a.citta, ' (', a.provincia, ')') AS indirizzo_completo,
    a.telefono,
    a.email,
    a.data_registrazione,
    a.attivo,
    COUNT(p.id_polizza) AS numero_polizze,
    COUNT(CASE WHEN sp.codice = 'ATTIVA' THEN 1 END) AS polizze_attive,
    COUNT(s.id_sinistro) AS numero_sinistri,
    COUNT(CASE WHEN ss.codice IN ('APERTO', 'IN_VALUTAZIONE') THEN 1 END) AS sinistri_aperti
FROM assicurati a
LEFT JOIN polizze p ON a.id_assicurato = p.id_assicurato
LEFT JOIN stato_polizza sp ON p.id_stato_polizza = sp.id_stato_polizza
LEFT JOIN sinistri s ON p.id_polizza = s.id_polizza
LEFT JOIN stato_sinistro ss ON s.id_stato_sinistro = ss.id_stato_sinistro
GROUP BY a.id_assicurato, a.codice_fiscale, a.nome, a.cognome, a.data_nascita, 
         a.indirizzo, a.cap, a.citta, a.provincia, a.telefono, a.email, 
         a.data_registrazione, a.attivo;

-- Vista per le polizze con dettagli assicurato e tipologia
CREATE VIEW v_polizze AS
SELECT 
    p.id_polizza,
    p.numero_polizza,
    p.id_assicurato,
    CONCAT(a.nome, ' ', a.cognome) AS assicurato,
    a.codice_fiscale,
    p.id_tipo_polizza,
    tp.descrizione AS tipo_polizza,
    tp.codice AS codice_tipo_polizza,
    p.data_inizio,
    p.data_scadenza,
    CASE 
        WHEN p.data_scadenza < CURRENT_DATE THEN 'SCADUTA'
        WHEN p.data_scadenza <= CURRENT_DATE + INTERVAL '30 days' THEN 'IN_SCADENZA'
        ELSE 'VALIDA'
    END AS stato_scadenza,
    p.premio_annuale,
    p.id_stato_polizza,
    sp.descrizione AS stato_polizza,
    sp.codice AS codice_stato_polizza,
    p.massimale,
    p.franchigia,
    p.data_creazione,
    p.data_modifica,
    COUNT(s.id_sinistro) AS numero_sinistri,
    COALESCE(SUM(s.importo_liquidato), 0) AS totale_liquidato,
    CASE 
        WHEN p.massimale > 0 THEN 
            ROUND((COALESCE(SUM(s.importo_liquidato), 0) / p.massimale * 100), 2)
        ELSE 0 
    END AS percentuale_utilizzo
FROM polizze p
JOIN assicurati a ON p.id_assicurato = a.id_assicurato
JOIN tipo_polizza tp ON p.id_tipo_polizza = tp.id_tipo_polizza
JOIN stato_polizza sp ON p.id_stato_polizza = sp.id_stato_polizza
LEFT JOIN sinistri s ON p.id_polizza = s.id_polizza AND s.id_stato_sinistro IN (
    SELECT id_stato_sinistro FROM stato_sinistro WHERE codice = 'CHIUSO'
)
GROUP BY p.id_polizza, p.numero_polizza, p.id_assicurato, a.nome, a.cognome, 
         a.codice_fiscale, p.id_tipo_polizza, tp.descrizione, tp.codice,
         p.data_inizio, p.data_scadenza, p.premio_annuale, p.id_stato_polizza,
         sp.descrizione, sp.codice, p.massimale, p.franchigia, 
         p.data_creazione, p.data_modifica;

-- Vista per gli operatori con ruolo e statistiche
CREATE VIEW v_operatori AS
SELECT 
    o.id_operatore,
    o.codice_operatore,
    o.nome,
    o.cognome,
    CONCAT(o.nome, ' ', o.cognome) AS nome_completo,
    o.id_ruolo_operatore,
    ro.descrizione AS ruolo,
    ro.codice AS codice_ruolo,
    ro.livello_autorizzazione,
    o.telefono,
    o.email,
    o.data_assunzione,
    o.data_cessazione,
    CASE 
        WHEN o.data_cessazione IS NULL THEN 'ATTIVO'
        ELSE 'CESSATO'
    END AS stato_operatore,
    o.attivo,
    COUNT(s.id_sinistro) AS sinistri_assegnati,
    COUNT(CASE WHEN ss.codice IN ('APERTO', 'IN_VALUTAZIONE') THEN 1 END) AS sinistri_aperti,
    COUNT(p.id_perizia) AS perizie_effettuate,
    AVG(p.importo_stimato) AS importo_medio_perizie
FROM operatori o
JOIN ruolo_operatore ro ON o.id_ruolo_operatore = ro.id_ruolo_operatore
LEFT JOIN sinistri s ON o.id_operatore = s.id_operatore_assegnato
LEFT JOIN stato_sinistro ss ON s.id_stato_sinistro = ss.id_stato_sinistro
LEFT JOIN perizie p ON o.id_operatore = p.id_operatore
GROUP BY o.id_operatore, o.codice_operatore, o.nome, o.cognome, 
         o.id_ruolo_operatore, ro.descrizione, ro.codice, ro.livello_autorizzazione,
         o.telefono, o.email, o.data_assunzione, o.data_cessazione, o.attivo;

-- Vista per i sinistri con tutte le informazioni correlate
CREATE VIEW v_sinistri AS
SELECT 
    s.id_sinistro,
    s.numero_sinistro,
    s.id_polizza,
    p.numero_polizza,
    p.id_assicurato,
    CONCAT(a.nome, ' ', a.cognome) AS assicurato,
    a.codice_fiscale,
    tp.descrizione AS tipo_polizza,
    s.data_sinistro,
    s.data_denuncia,
    s.luogo_sinistro,
    s.descrizione,
    s.id_tipo_sinistro,
    ts.descrizione AS tipo_sinistro,
    ts.codice AS codice_tipo_sinistro,
    s.id_stato_sinistro,
    ss.descrizione AS stato_sinistro,
    ss.codice AS codice_stato_sinistro,
    ss.colore AS colore_stato,
    s.importo_richiesto,
    s.importo_liquidato,
    CASE 
        WHEN s.importo_richiesto > 0 AND s.importo_liquidato > 0 THEN
            ROUND((s.importo_liquidato / s.importo_richiesto * 100), 2)
        ELSE 0
    END AS percentuale_liquidazione,
    s.data_chiusura,
    CASE 
        WHEN s.data_chiusura IS NOT NULL THEN 
            s.data_chiusura - s.data_sinistro
        ELSE 
            CURRENT_DATE - s.data_sinistro
    END AS giorni_gestione,
    s.note,
    s.id_operatore_assegnato,
    CONCAT(op.nome, ' ', op.cognome) AS operatore_assegnato,
    rop.descrizione AS ruolo_operatore,
    s.priorita,
    CASE s.priorita
        WHEN 1 THEN 'ALTA'
        WHEN 2 THEN 'MEDIA'
        WHEN 3 THEN 'BASSA'
        ELSE 'NON DEFINITA'
    END AS priorita_desc,
    s.data_creazione,
    s.data_modifica,
    COUNT(per.id_perizia) AS numero_perizie,
    COUNT(pag.id_pagamento) AS numero_pagamenti,
    COALESCE(SUM(pag.importo), 0) AS totale_pagamenti
FROM sinistri s
JOIN polizze p ON s.id_polizza = p.id_polizza
JOIN assicurati a ON p.id_assicurato = a.id_assicurato
JOIN tipo_polizza tp ON p.id_tipo_polizza = tp.id_tipo_polizza
JOIN tipo_sinistro ts ON s.id_tipo_sinistro = ts.id_tipo_sinistro
JOIN stato_sinistro ss ON s.id_stato_sinistro = ss.id_stato_sinistro
LEFT JOIN operatori op ON s.id_operatore_assegnato = op.id_operatore
LEFT JOIN ruolo_operatore rop ON op.id_ruolo_operatore = rop.id_ruolo_operatore
LEFT JOIN perizie per ON s.id_sinistro = per.id_sinistro
LEFT JOIN pagamenti pag ON s.id_sinistro = pag.id_sinistro
GROUP BY s.id_sinistro, s.numero_sinistro, s.id_polizza, p.numero_polizza,
         p.id_assicurato, a.nome, a.cognome, a.codice_fiscale, tp.descrizione,
         s.data_sinistro, s.data_denuncia, s.luogo_sinistro, s.descrizione,
         s.id_tipo_sinistro, ts.descrizione, ts.codice, s.id_stato_sinistro,
         ss.descrizione, ss.codice, ss.colore, s.importo_richiesto, 
         s.importo_liquidato, s.data_chiusura, s.note, s.id_operatore_assegnato,
         op.nome, op.cognome, rop.descrizione, s.priorita, s.data_creazione, 
         s.data_modifica;

-- Vista per le perizie con dettagli completi
CREATE VIEW v_perizie AS
SELECT 
    pe.id_perizia,
    pe.id_sinistro,
    s.numero_sinistro,
    pe.id_operatore,
    CONCAT(o.nome, ' ', o.cognome) AS perito,
    o.codice_operatore,
    ro.descrizione AS ruolo_perito,
    pe.data_perizia,
    pe.id_tipo_perizia,
    tp.descrizione AS tipo_perizia,
    tp.codice AS codice_tipo_perizia,
    pe.id_esito_perizia,
    ep.descrizione AS esito_perizia,
    ep.codice AS codice_esito_perizia,
    ep.favorevole AS esito_favorevole,
    pe.importo_stimato,
    s.importo_richiesto,
    CASE 
        WHEN s.importo_richiesto > 0 AND pe.importo_stimato > 0 THEN
            ROUND((pe.importo_stimato / s.importo_richiesto * 100), 2)
        ELSE 0
    END AS percentuale_stima_su_richiesto,
    pe.relazione,
    pe.allegati,
    pe.data_creazione,
    -- Informazioni sinistro correlato
    CONCAT(a.nome, ' ', a.cognome) AS assicurato,
    p.numero_polizza,
    ts.descrizione AS tipo_sinistro,
    ss.descrizione AS stato_sinistro,
    s.data_sinistro,
    s.luogo_sinistro
FROM perizie pe
JOIN sinistri s ON pe.id_sinistro = s.id_sinistro
JOIN operatori o ON pe.id_operatore = o.id_operatore
JOIN ruolo_operatore ro ON o.id_ruolo_operatore = ro.id_ruolo_operatore
JOIN tipo_perizia tp ON pe.id_tipo_perizia = tp.id_tipo_perizia
JOIN esito_perizia ep ON pe.id_esito_perizia = ep.id_esito_perizia
JOIN polizze p ON s.id_polizza = p.id_polizza
JOIN assicurati a ON p.id_assicurato = a.id_assicurato
JOIN tipo_sinistro ts ON s.id_tipo_sinistro = ts.id_tipo_sinistro
JOIN stato_sinistro ss ON s.id_stato_sinistro = ss.id_stato_sinistro;

-- ===============================
-- VIEWS ANALITICHE E REPORT
-- ===============================

-- Vista per dashboard sinistri aperti
CREATE VIEW v_dashboard_sinistri_aperti AS
SELECT 
    ss.descrizione AS stato,
    ss.colore,
    COUNT(*) AS numero_sinistri,
    SUM(s.importo_richiesto) AS importo_totale_richiesto,
    AVG(s.importo_richiesto) AS importo_medio_richiesto,
    AVG(CURRENT_DATE - s.data_sinistro) AS giorni_medi_apertura
FROM sinistri s
JOIN stato_sinistro ss ON s.id_stato_sinistro = ss.id_stato_sinistro
WHERE ss.codice IN ('APERTO', 'IN_VALUTAZIONE', 'SOSPESO')
GROUP BY ss.id_stato_sinistro, ss.descrizione, ss.colore, ss.ordinamento
ORDER BY ss.ordinamento;

-- Vista per statistiche operatori
CREATE VIEW v_statistiche_operatori AS
SELECT 
    o.id_operatore,
    CONCAT(o.nome, ' ', o.cognome) AS operatore,
    ro.descrizione AS ruolo,
    COUNT(s.id_sinistro) AS sinistri_totali,
    COUNT(CASE WHEN ss.codice IN ('APERTO', 'IN_VALUTAZIONE') THEN 1 END) AS sinistri_aperti,
    COUNT(CASE WHEN ss.codice = 'CHIUSO' THEN 1 END) AS sinistri_chiusi,
    ROUND(
        COUNT(CASE WHEN ss.codice = 'CHIUSO' THEN 1 END)::DECIMAL / 
        NULLIF(COUNT(s.id_sinistro), 0) * 100, 2
    ) AS percentuale_chiusura,
    AVG(CASE WHEN ss.codice = 'CHIUSO' THEN s.data_chiusura - s.data_sinistro END) AS giorni_medi_chiusura,
    COUNT(pe.id_perizia) AS perizie_effettuate,
    AVG(pe.importo_stimato) AS importo_medio_perizie
FROM operatori o
JOIN ruolo_operatore ro ON o.id_ruolo_operatore = ro.id_ruolo_operatore
LEFT JOIN sinistri s ON o.id_operatore = s.id_operatore_assegnato
LEFT JOIN stato_sinistro ss ON s.id_stato_sinistro = ss.id_stato_sinistro
LEFT JOIN perizie pe ON o.id_operatore = pe.id_operatore
WHERE o.attivo = TRUE
GROUP BY o.id_operatore, o.nome, o.cognome, ro.descrizione
ORDER BY sinistri_totali DESC;

-- Vista per report polizze per tipologia
CREATE VIEW v_report_polizze_tipologia AS
SELECT 
    tp.descrizione AS tipo_polizza,
    sp.descrizione AS stato_polizza,
    COUNT(*) AS numero_polizze,
    SUM(p.premio_annuale) AS premio_totale,
    AVG(p.premio_annuale) AS premio_medio,
    SUM(p.massimale) AS massimale_totale,
    COUNT(s.id_sinistro) AS numero_sinistri,
    COALESCE(SUM(s.importo_liquidato), 0) AS importo_liquidato_totale,
    ROUND(
        COALESCE(SUM(s.importo_liquidato), 0) / NULLIF(SUM(p.premio_annuale), 0) * 100, 2
    ) AS rapporto_sinistri_premi
FROM polizze p
JOIN tipo_polizza tp ON p.id_tipo_polizza = tp.id_tipo_polizza
JOIN stato_polizza sp ON p.id_stato_polizza = sp.id_stato_polizza
LEFT JOIN sinistri s ON p.id_polizza = s.id_polizza 
    AND s.id_stato_sinistro IN (SELECT id_stato_sinistro FROM stato_sinistro WHERE codice = 'CHIUSO')
GROUP BY tp.id_tipo_polizza, tp.descrizione, sp.id_stato_polizza, sp.descrizione
ORDER BY tp.ordinamento, sp.ordinamento;