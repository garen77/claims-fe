import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeriziaView, Perizia, TipoPerizia, EsitoPerizia, SinistroView, OperatoreView } from '../../models/insurance.models';

@Component({
  selector: 'app-perizie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perizie.component.html',
  styleUrls: ['./perizie.component.css']
})
export class PerizieComponent implements OnInit {
  perizie = signal<PeriziaView[]>([]);
  filteredPerizie = signal<PeriziaView[]>([]);
  tipiPerizia = signal<TipoPerizia[]>([]);
  esitiPerizia = signal<EsitoPerizia[]>([]);
  sinistri = signal<SinistroView[]>([]);
  operatori = signal<OperatoreView[]>([]);
  selectedPerizia = signal<Perizia | null>(null);
  isModalOpen = signal(false);
  isEditing = signal(false);
  searchTerm = signal('');
  filterTipo = signal('all');
  filterEsito = signal('all');
  filterOperatore = signal('all');
  filterPeriodo = signal('all'); // 'all', 'ultima_settimana', 'ultimo_mese', 'ultimo_trimestre'

  newPerizia: Perizia = {
    id_perizia: 0,
    id_sinistro: 0,
    id_operatore: 0,
    data_perizia: '',
    id_tipo_perizia: 1,
    id_esito_perizia: 1,
    importo_stimato: 0,
    relazione: '',
    allegati: '',
    data_creazione: ''
  };

  ngOnInit() {
    this.loadTipiPerizia();
    this.loadEsitiPerizia();
    this.loadSinistri();
    this.loadOperatori();
    this.loadPerizie();
  }

  loadTipiPerizia() {
    const mockTipi: TipoPerizia[] = [
      { id_tipo_perizia: 1, codice: 'VAL_DANNI', descrizione: 'Valutazione Danni', attivo: true, ordinamento: 1 },
      { id_tipo_perizia: 2, codice: 'SOPRALLUOGO', descrizione: 'Sopralluogo', attivo: true, ordinamento: 2 },
      { id_tipo_perizia: 3, codice: 'PER_MEDICA', descrizione: 'Perizia Medica', attivo: true, ordinamento: 3 },
      { id_tipo_perizia: 4, codice: 'STIMA_RIP', descrizione: 'Stima Riparazione', attivo: true, ordinamento: 4 }
    ];
    this.tipiPerizia.set(mockTipi);
  }

  loadEsitiPerizia() {
    const mockEsiti: EsitoPerizia[] = [
      { id_esito_perizia: 1, codice: 'FAVOREVOLE', descrizione: 'Favorevole', favorevole: true, attivo: true, ordinamento: 1 },
      { id_esito_perizia: 2, codice: 'PARZ_FAVOR', descrizione: 'Parzialmente Favorevole', favorevole: true, attivo: true, ordinamento: 2 },
      { id_esito_perizia: 3, codice: 'SFAVOREVOLE', descrizione: 'Sfavorevole', favorevole: false, attivo: true, ordinamento: 3 },
      { id_esito_perizia: 4, codice: 'DA_APPROF', descrizione: 'Da Approfondire', favorevole: undefined, attivo: true, ordinamento: 4 }
    ];
    this.esitiPerizia.set(mockEsiti);
  }

  loadSinistri() {
    // Mock data simplified
    const mockSinistri: SinistroView[] = [
      {
        id_sinistro: 1,
        numero_sinistro: 'SIN-2024-001',
        id_polizza: 1,
        numero_polizza: 'AUTO-2024-001',
        id_assicurato: 1,
        assicurato: 'Mario Rossi',
        codice_fiscale: 'RSSMRA80A01H501Z',
        tipo_polizza: 'Polizza Auto',
        data_sinistro: '2024-07-15',
        data_denuncia: '2024-07-16T10:30:00',
        luogo_sinistro: 'Via Roma, Milano',
        descrizione: 'Incidente stradale con tamponamento',
        id_tipo_sinistro: 1,
        tipo_sinistro: 'Incidente Stradale',
        codice_tipo_sinistro: 'INC_STRADALE',
        id_stato_sinistro: 2,
        stato_sinistro: 'In Valutazione',
        codice_stato_sinistro: 'IN_VALUTAZIONE',
        importo_richiesto: 3500.00,
        importo_liquidato: 0,
        percentuale_liquidazione: 0,
        giorni_gestione: 108,
        note: 'In attesa di perizia tecnica',
        id_operatore_assegnato: 1,
        operatore_assegnato: 'Marco Verdi',
        ruolo_operatore: 'Perito',
        priorita: 2,
        priorita_desc: 'MEDIA',
        data_creazione: '2024-07-16T10:30:00',
        data_modifica: '2024-07-20T14:15:00',
        numero_perizie: 1,
        numero_pagamenti: 0,
        totale_pagamenti: 0
      }
    ];
    this.sinistri.set(mockSinistri);
  }

  loadOperatori() {
    const mockOperatori: OperatoreView[] = [
      {
        id_operatore: 1,
        codice_operatore: 'OP001',
        nome: 'Marco',
        cognome: 'Verdi',
        nome_completo: 'Marco Verdi',
        id_ruolo_operatore: 1,
        ruolo: 'Perito',
        codice_ruolo: 'PERITO',
        livello_autorizzazione: 2,
        email: 'marco.verdi@assicurazioni.com',
        stato_operatore: 'ATTIVO',
        attivo: true,
        sinistri_assegnati: 15,
        sinistri_aperti: 5,
        perizie_effettuate: 23
      },
      {
        id_operatore: 2,
        codice_operatore: 'OP002',
        nome: 'Laura',
        cognome: 'Neri',
        nome_completo: 'Laura Neri',
        id_ruolo_operatore: 2,
        ruolo: 'Liquidatore',
        codice_ruolo: 'LIQUIDATORE',
        livello_autorizzazione: 3,
        email: 'laura.neri@assicurazioni.com',
        stato_operatore: 'ATTIVO',
        attivo: true,
        sinistri_assegnati: 32,
        sinistri_aperti: 8,
        perizie_effettuate: 45
      }
    ];
    this.operatori.set(mockOperatori);
  }

  loadPerizie() {
    // Mock data
    const mockData: PeriziaView[] = [
      {
        id_perizia: 1,
        id_sinistro: 1,
        numero_sinistro: 'SIN-2024-001',
        id_operatore: 1,
        perito: 'Marco Verdi',
        codice_operatore: 'OP001',
        ruolo_perito: 'Perito',
        data_perizia: '2024-07-20',
        id_tipo_perizia: 1,
        tipo_perizia: 'Valutazione Danni',
        codice_tipo_perizia: 'VAL_DANNI',
        id_esito_perizia: 2,
        esito_perizia: 'Parzialmente Favorevole',
        codice_esito_perizia: 'PARZ_FAVOR',
        esito_favorevole: true,
        importo_stimato: 3200.00,
        importo_richiesto: 3500.00,
        percentuale_stima_su_richiesto: 91.43,
        relazione: 'Dopo sopralluogo e valutazione dei danni, si conferma il tamponamento. Danni compatibili con la dinamica dichiarata. Necessaria sostituzione paraurti posteriore e riparazione carrozzeria.',
        allegati: 'foto_danno_1.jpg,foto_danno_2.jpg,preventivo_carrozzeria.pdf',
        data_creazione: '2024-07-20T14:30:00',
        assicurato: 'Mario Rossi',
        numero_polizza: 'AUTO-2024-001',
        tipo_sinistro: 'Incidente Stradale',
        stato_sinistro: 'In Valutazione',
        data_sinistro: '2024-07-15',
        luogo_sinistro: 'Via Roma, Milano'
      },
      {
        id_perizia: 2,
        id_sinistro: 1,
        numero_sinistro: 'SIN-2024-001',
        id_operatore: 2,
        perito: 'Laura Neri',
        codice_operatore: 'OP002',
        ruolo_perito: 'Liquidatore',
        data_perizia: '2024-07-25',
        id_tipo_perizia: 4,
        tipo_perizia: 'Stima Riparazione',
        codice_tipo_perizia: 'STIMA_RIP',
        id_esito_perizia: 1,
        esito_perizia: 'Favorevole',
        codice_esito_perizia: 'FAVOREVOLE',
        esito_favorevole: true,
        importo_stimato: 2850.00,
        importo_richiesto: 3500.00,
        percentuale_stima_su_richiesto: 81.43,
        relazione: 'Valutazione economica dei lavori di riparazione. Preventivi conformi ai prezzi di mercato. Si propone liquidazione per importo stimato.',
        allegati: 'preventivo_definitivo.pdf,analisi_costi.xlsx',
        data_creazione: '2024-07-25T11:15:00',
        assicurato: 'Mario Rossi',
        numero_polizza: 'AUTO-2024-001',
        tipo_sinistro: 'Incidente Stradale',
        stato_sinistro: 'In Valutazione',
        data_sinistro: '2024-07-15',
        luogo_sinistro: 'Via Roma, Milano'
      }
    ];

    this.perizie.set(mockData);
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.perizie();

    // Filter by search term
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(p => 
        p.numero_sinistro.toLowerCase().includes(term) ||
        p.assicurato.toLowerCase().includes(term) ||
        p.perito.toLowerCase().includes(term) ||
        p.tipo_perizia.toLowerCase().includes(term) ||
        p.relazione?.toLowerCase().includes(term)
      );
    }

    // Filter by tipo
    if (this.filterTipo() !== 'all') {
      const tipoId = parseInt(this.filterTipo());
      filtered = filtered.filter(p => p.id_tipo_perizia === tipoId);
    }

    // Filter by esito
    if (this.filterEsito() !== 'all') {
      const esitoId = parseInt(this.filterEsito());
      filtered = filtered.filter(p => p.id_esito_perizia === esitoId);
    }

    // Filter by operatore
    if (this.filterOperatore() !== 'all') {
      const operatoreId = parseInt(this.filterOperatore());
      filtered = filtered.filter(p => p.id_operatore === operatoreId);
    }

    // Filter by periodo
    if (this.filterPeriodo() !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (this.filterPeriodo()) {
        case 'ultima_settimana':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'ultimo_mese':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'ultimo_trimestre':
          startDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(p => new Date(p.data_perizia) >= startDate);
    }

    this.filteredPerizie.set(filtered);
  }

  onSearchChange(event: any) {
    this.searchTerm.set(event.target.value);
    this.applyFilters();
  }

  onTipoFilterChange(event: any) {
    this.filterTipo.set(event.target.value);
    this.applyFilters();
  }

  onEsitoFilterChange(event: any) {
    this.filterEsito.set(event.target.value);
    this.applyFilters();
  }

  onOperatoreFilterChange(event: any) {
    this.filterOperatore.set(event.target.value);
    this.applyFilters();
  }

  onPeriodoFilterChange(event: any) {
    this.filterPeriodo.set(event.target.value);
    this.applyFilters();
  }

  openCreateModal() {
    this.isEditing.set(false);
    this.newPerizia = {
      id_perizia: 0,
      id_sinistro: 0,
      id_operatore: 0,
      data_perizia: '',
      id_tipo_perizia: 1,
      id_esito_perizia: 1,
      importo_stimato: 0,
      relazione: '',
      allegati: '',
      data_creazione: ''
    };
    this.isModalOpen.set(true);
  }

  openEditModal(perizia: PeriziaView) {
    this.isEditing.set(true);
    this.newPerizia = {
      id_perizia: perizia.id_perizia,
      id_sinistro: perizia.id_sinistro,
      id_operatore: perizia.id_operatore,
      data_perizia: perizia.data_perizia,
      id_tipo_perizia: perizia.id_tipo_perizia,
      id_esito_perizia: perizia.id_esito_perizia,
      importo_stimato: perizia.importo_stimato || 0,
      relazione: perizia.relazione || '',
      allegati: perizia.allegati || '',
      data_creazione: perizia.data_creazione
    };
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedPerizia.set(null);
  }

  savePerizia() {
    if (this.isEditing()) {
      console.log('Updating perizia:', this.newPerizia);
    } else {
      console.log('Creating new perizia:', this.newPerizia);
    }
    this.closeModal();
    this.loadPerizie();
  }

  deletePerizia(id: number) {
    if (confirm('Sei sicuro di voler eliminare questa perizia?')) {
      console.log('Deleting perizia:', id);
      this.loadPerizie();
    }
  }

  viewDetails(perizia: PeriziaView) {
    this.selectedPerizia.set(perizia as any);
    console.log('Viewing details for:', perizia);
  }

  getEsitoBadgeClass(esito: string, favorevole?: boolean): string {
    if (favorevole === true) return 'badge-success';
    if (favorevole === false) return 'badge-danger';
    return 'badge-warning';
  }

  getTipoBadgeClass(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'valutazione danni': return 'badge-primary';
      case 'sopralluogo': return 'badge-info';
      case 'perizia medica': return 'badge-warning';
      case 'stima riparazione': return 'badge-secondary';
      default: return 'badge-light';
    }
  }

  getPercentualeBadgeClass(percentuale: number): string {
    if (percentuale >= 90) return 'percentuale-alta';
    if (percentuale >= 70) return 'percentuale-media';
    if (percentuale >= 50) return 'percentuale-bassa';
    return 'percentuale-molto-bassa';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('it-IT');
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('it-IT');
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '-';
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  truncateText(text: string | undefined, maxLength: number): string {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  countAllegati(allegati: string | undefined): number {
    if (!allegati) return 0;
    return allegati.split(',').filter(a => a.trim().length > 0).length;
  }

  getGradientStyle(percentuale: number): any {
    const hue = (percentuale / 100) * 120; // Da rosso (0) a verde (120)
    return {
      'background': `linear-gradient(90deg, hsl(${hue}, 70%, 50%) ${percentuale}%, #e9ecef ${percentuale}%)`
    };
  }
}