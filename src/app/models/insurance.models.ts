// Interfaces per il sistema di gestione sinistri assicurativi

export interface Assicurato {
  id_assicurato: number;
  codice_fiscale: string;
  nome: string;
  cognome: string;
  data_nascita: string;
  indirizzo?: string;
  cap?: string;
  citta?: string;
  provincia?: string;
  telefono?: string;
  email?: string;
  data_registrazione: string;
  attivo: boolean;
}

export interface TipoPolizza {
  id_tipo_polizza: number;
  codice: string;
  descrizione: string;
  attivo: boolean;
  ordinamento: number;
}

export interface StatoPolizza {
  id_stato_polizza: number;
  codice: string;
  descrizione: string;
  attivo: boolean;
  ordinamento: number;
}

export interface Polizza {
  id_polizza: number;
  numero_polizza: string;
  id_assicurato: number;
  id_tipo_polizza: number;
  data_inizio: string;
  data_scadenza: string;
  premio_annuale: number;
  id_stato_polizza: number;
  massimale?: number;
  franchigia?: number;
  data_creazione: string;
  data_modifica: string;
}

export interface RuoloOperatore {
  id_ruolo_operatore: number;
  codice: string;
  descrizione: string;
  livello_autorizzazione: number;
  attivo: boolean;
  ordinamento: number;
}

export interface Operatore {
  id_operatore: number;
  codice_operatore: string;
  nome: string;
  cognome: string;
  id_ruolo_operatore: number;
  telefono?: string;
  email: string;
  data_assunzione?: string;
  data_cessazione?: string;
  attivo: boolean;
}

export interface TipoSinistro {
  id_tipo_sinistro: number;
  codice: string;
  descrizione: string;
  attivo: boolean;
  ordinamento: number;
}

export interface StatoSinistro {
  id_stato_sinistro: number;
  codice: string;
  descrizione: string;
  attivo: boolean;
  ordinamento: number;
  colore?: string;
}

export interface Sinistro {
  id_sinistro: number;
  numero_sinistro: string;
  id_polizza: number;
  data_sinistro: string;
  data_denuncia: string;
  luogo_sinistro?: string;
  descrizione: string;
  id_tipo_sinistro: number;
  id_stato_sinistro: number;
  importo_richiesto?: number;
  importo_liquidato?: number;
  data_chiusura?: string;
  note?: string;
  id_operatore_assegnato?: number;
  priorita: number;
  data_creazione: string;
  data_modifica: string;
}

export interface TipoPerizia {
  id_tipo_perizia: number;
  codice: string;
  descrizione: string;
  attivo: boolean;
  ordinamento: number;
}

export interface EsitoPerizia {
  id_esito_perizia: number;
  codice: string;
  descrizione: string;
  favorevole?: boolean;
  attivo: boolean;
  ordinamento: number;
}

export interface Perizia {
  id_perizia: number;
  id_sinistro: number;
  id_operatore: number;
  data_perizia: string;
  id_tipo_perizia: number;
  id_esito_perizia: number;
  importo_stimato?: number;
  relazione?: string;
  allegati?: string;
  data_creazione: string;
}

// Interfaces per le view
export interface AssicuratoView {
  id_assicurato: number;
  codice_fiscale: string;
  nome: string;
  cognome: string;
  nome_completo: string;
  data_nascita: string;
  eta: number;
  indirizzo?: string;
  cap?: string;
  citta?: string;
  provincia?: string;
  indirizzo_completo?: string;
  telefono?: string;
  email?: string;
  data_registrazione: string;
  attivo: boolean;
  numero_polizze: number;
  polizze_attive: number;
  numero_sinistri: number;
  sinistri_aperti: number;
}

export interface PolizzaView {
  id_polizza: number;
  numero_polizza: string;
  id_assicurato: number;
  assicurato: string;
  codice_fiscale: string;
  id_tipo_polizza: number;
  tipo_polizza: string;
  codice_tipo_polizza: string;
  data_inizio: string;
  data_scadenza: string;
  stato_scadenza: string;
  premio_annuale: number;
  id_stato_polizza: number;
  stato_polizza: string;
  codice_stato_polizza: string;
  massimale?: number;
  franchigia?: number;
  data_creazione: string;
  data_modifica: string;
  numero_sinistri: number;
  totale_liquidato: number;
  percentuale_utilizzo: number;
}

export interface OperatoreView {
  id_operatore: number;
  codice_operatore: string;
  nome: string;
  cognome: string;
  nome_completo: string;
  id_ruolo_operatore: number;
  ruolo: string;
  codice_ruolo: string;
  livello_autorizzazione: number;
  telefono?: string;
  email: string;
  data_assunzione?: string;
  data_cessazione?: string;
  stato_operatore: string;
  attivo: boolean;
  sinistri_assegnati: number;
  sinistri_aperti: number;
  perizie_effettuate: number;
  importo_medio_perizie?: number;
}

export interface SinistroView {
  id_sinistro: number;
  numero_sinistro: string;
  id_polizza: number;
  numero_polizza: string;
  id_assicurato: number;
  assicurato: string;
  codice_fiscale: string;
  tipo_polizza: string;
  data_sinistro: string;
  data_denuncia: string;
  luogo_sinistro?: string;
  descrizione: string;
  id_tipo_sinistro: number;
  tipo_sinistro: string;
  codice_tipo_sinistro: string;
  id_stato_sinistro: number;
  stato_sinistro: string;
  codice_stato_sinistro: string;
  colore_stato?: string;
  importo_richiesto?: number;
  importo_liquidato?: number;
  percentuale_liquidazione: number;
  data_chiusura?: string;
  giorni_gestione: number;
  note?: string;
  id_operatore_assegnato?: number;
  operatore_assegnato?: string;
  ruolo_operatore?: string;
  priorita: number;
  priorita_desc: string;
  data_creazione: string;
  data_modifica: string;
  numero_perizie: number;
  numero_pagamenti: number;
  totale_pagamenti: number;
}

export interface PeriziaView {
  id_perizia: number;
  id_sinistro: number;
  numero_sinistro: string;
  id_operatore: number;
  perito: string;
  codice_operatore: string;
  ruolo_perito: string;
  data_perizia: string;
  id_tipo_perizia: number;
  tipo_perizia: string;
  codice_tipo_perizia: string;
  id_esito_perizia: number;
  esito_perizia: string;
  codice_esito_perizia: string;
  esito_favorevole?: boolean;
  importo_stimato?: number;
  importo_richiesto?: number;
  percentuale_stima_su_richiesto: number;
  relazione?: string;
  allegati?: string;
  data_creazione: string;
  assicurato: string;
  numero_polizza: string;
  tipo_sinistro: string;
  stato_sinistro: string;
  data_sinistro: string;
  luogo_sinistro?: string;
}