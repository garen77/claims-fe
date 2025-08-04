import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SinistroView, Sinistro, TipoSinistro, StatoSinistro, PolizzaView, OperatoreView } from '../../models/insurance.models';

@Component({
  selector: 'app-sinistri',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sinistri.component.html',
  styleUrls: ['./sinistri.component.css']
})
export class SinistriComponent implements OnInit {
  sinistri = signal<SinistroView[]>([]);
  filteredSinistri = signal<SinistroView[]>([]);
  tipiSinistro = signal<TipoSinistro[]>([]);
  statiSinistro = signal<StatoSinistro[]>([]);
  polizze = signal<PolizzaView[]>([]);
  operatori = signal<OperatoreView[]>([]);
  selectedSinistro = signal<Sinistro | null>(null);
  isModalOpen = signal(false);
  isEditing = signal(false);
  searchTerm = signal('');
  filterTipo = signal('all');
  filterStato = signal('all');
  filterPriorita = signal('all');
  filterOperatore = signal('all');

  newSinistro: Sinistro = {
    id_sinistro: 0,
    numero_sinistro: '',
    id_polizza: 0,
    data_sinistro: '',
    data_denuncia: '',
    luogo_sinistro: '',
    descrizione: '',
    id_tipo_sinistro: 1,
    id_stato_sinistro: 1,
    importo_richiesto: 0,
    importo_liquidato: 0,
    data_chiusura: '',
    note: '',
    id_operatore_assegnato: 0,
    priorita: 3,
    data_creazione: '',
    data_modifica: ''
  };

  ngOnInit() {
    this.loadTipiSinistro();
    this.loadStatiSinistro();
    this.loadPolizze();
    this.loadOperatori();
    this.loadSinistri();
  }

  loadTipiSinistro() {
    const mockTipi: TipoSinistro[] = [
      { id_tipo_sinistro: 1, codice: 'INC_STRADALE', descrizione: 'Incidente Stradale', attivo: true, ordinamento: 1 },
      { id_tipo_sinistro: 2, codice: 'FURTO', descrizione: 'Furto', attivo: true, ordinamento: 2 },
      { id_tipo_sinistro: 3, codice: 'INCENDIO', descrizione: 'Incendio', attivo: true, ordinamento: 3 },
      { id_tipo_sinistro: 4, codice: 'DANNI_ACQUA', descrizione: 'Danni da Acqua', attivo: true, ordinamento: 4 },
      { id_tipo_sinistro: 5, codice: 'RC', descrizione: 'Responsabilità Civile', attivo: true, ordinamento: 5 },
      { id_tipo_sinistro: 6, codice: 'ALTRO', descrizione: 'Altro', attivo: true, ordinamento: 99 }
    ];
    this.tipiSinistro.set(mockTipi);
  }

  loadStatiSinistro() {
    const mockStati: StatoSinistro[] = [
      { id_stato_sinistro: 1, codice: 'APERTO', descrizione: 'Aperto', attivo: true, ordinamento: 1, colore: '#FF6B6B' },
      { id_stato_sinistro: 2, codice: 'IN_VALUTAZIONE', descrizione: 'In Valutazione', attivo: true, ordinamento: 2, colore: '#4ECDC4' },
      { id_stato_sinistro: 3, codice: 'CHIUSO', descrizione: 'Chiuso', attivo: true, ordinamento: 3, colore: '#45B7D1' },
      { id_stato_sinistro: 4, codice: 'RESPINTO', descrizione: 'Respinto', attivo: true, ordinamento: 4, colore: '#96CEB4' },
      { id_stato_sinistro: 5, codice: 'SOSPESO', descrizione: 'Sospeso', attivo: true, ordinamento: 5, colore: '#FECA57' }
    ];
    this.statiSinistro.set(mockStati);
  }

  loadPolizze() {
    // Mock data simplified for dropdown
    const mockPolizze: PolizzaView[] = [
      {
        id_polizza: 1,
        numero_polizza: 'AUTO-2024-001',
        id_assicurato: 1,
        assicurato: 'Mario Rossi',
        codice_fiscale: 'RSSMRA80A01H501Z',
        id_tipo_polizza: 1,
        tipo_polizza: 'Polizza Auto',
        codice_tipo_polizza: 'AUTO',
        data_inizio: '2024-01-15',
        data_scadenza: '2025-01-15',
        stato_scadenza: 'VALIDA',
        premio_annuale: 850.00,
        id_stato_polizza: 1,
        stato_polizza: 'Attiva',
        codice_stato_polizza: 'ATTIVA',
        data_creazione: '2024-01-10T09:00:00',
        data_modifica: '2024-01-10T09:00:00',
        numero_sinistri: 1,
        totale_liquidato: 2500.00,
        percentuale_utilizzo: 5.0
      }
    ];
    this.polizze.set(mockPolizze);
  }

  loadOperatori() {
    // Mock data simplified
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

  loadSinistri() {
    // Mock data
    const mockData: SinistroView[] = [
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
        colore_stato: '#4ECDC4',
        importo_richiesto: 3500.00,
        importo_liquidato: 0,
        percentuale_liquidazione: 0,
        data_chiusura: undefined,
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
      },
      {
        id_sinistro: 2,
        numero_sinistro: 'SIN-2024-002',
        id_polizza: 1,
        numero_polizza: 'AUTO-2024-001',
        id_assicurato: 1,
        assicurato: 'Mario Rossi',
        codice_fiscale: 'RSSMRA80A01H501Z',
        tipo_polizza: 'Polizza Auto',
        data_sinistro: '2024-05-10',
        data_denuncia: '2024-05-10T16:45:00',
        luogo_sinistro: 'Parcheggio centro commerciale',
        descrizione: 'Danni da grandine al veicolo',
        id_tipo_sinistro: 6,
        tipo_sinistro: 'Altro',
        codice_tipo_sinistro: 'ALTRO',
        id_stato_sinistro: 3,
        stato_sinistro: 'Chiuso',
        codice_stato_sinistro: 'CHIUSO',
        colore_stato: '#45B7D1',
        importo_richiesto: 2200.00,
        importo_liquidato: 1900.00,
        percentuale_liquidazione: 86.36,
        data_chiusura: '2024-06-15',
        giorni_gestione: 36,
        note: 'Liquidazione completata',
        id_operatore_assegnato: 2,
        operatore_assegnato: 'Laura Neri',
        ruolo_operatore: 'Liquidatore',
        priorita: 3,
        priorita_desc: 'BASSA',
        data_creazione: '2024-05-10T16:45:00',
        data_modifica: '2024-06-15T09:30:00',
        numero_perizie: 1,
        numero_pagamenti: 1,
        totale_pagamenti: 1900.00
      }
    ];

    this.sinistri.set(mockData);
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.sinistri();

    // Filter by search term
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(s => 
        s.numero_sinistro.toLowerCase().includes(term) ||
        s.assicurato.toLowerCase().includes(term) ||
        s.codice_fiscale.toLowerCase().includes(term) ||
        s.descrizione.toLowerCase().includes(term) ||
        s.luogo_sinistro?.toLowerCase().includes(term)
      );
    }

    // Filter by tipo
    if (this.filterTipo() !== 'all') {
      const tipoId = parseInt(this.filterTipo());
      filtered = filtered.filter(s => s.id_tipo_sinistro === tipoId);
    }

    // Filter by stato
    if (this.filterStato() !== 'all') {
      const statoId = parseInt(this.filterStato());
      filtered = filtered.filter(s => s.id_stato_sinistro === statoId);
    }

    // Filter by priorita
    if (this.filterPriorita() !== 'all') {
      const priorita = parseInt(this.filterPriorita());
      filtered = filtered.filter(s => s.priorita === priorita);
    }

    // Filter by operatore
    if (this.filterOperatore() !== 'all') {
      const operatoreId = parseInt(this.filterOperatore());
      filtered = filtered.filter(s => s.id_operatore_assegnato === operatoreId);
    }

    this.filteredSinistri.set(filtered);
  }

  onSearchChange(event: any) {
    this.searchTerm.set(event.target.value);
    this.applyFilters();
  }

  onTipoFilterChange(event: any) {
    this.filterTipo.set(event.target.value);
    this.applyFilters();
  }

  onStatoFilterChange(event: any) {
    this.filterStato.set(event.target.value);
    this.applyFilters();
  }

  onPrioritaFilterChange(event: any) {
    this.filterPriorita.set(event.target.value);
    this.applyFilters();
  }

  onOperatoreFilterChange(event: any) {
    this.filterOperatore.set(event.target.value);
    this.applyFilters();
  }

  openCreateModal() {
    this.isEditing.set(false);
    this.newSinistro = {
      id_sinistro: 0,
      numero_sinistro: '',
      id_polizza: 0,
      data_sinistro: '',
      data_denuncia: '',
      luogo_sinistro: '',
      descrizione: '',
      id_tipo_sinistro: 1,
      id_stato_sinistro: 1,
      importo_richiesto: 0,
      importo_liquidato: 0,
      data_chiusura: '',
      note: '',
      id_operatore_assegnato: 0,
      priorita: 3,
      data_creazione: '',
      data_modifica: ''
    };
    this.isModalOpen.set(true);
  }

  openEditModal(sinistro: SinistroView) {
    this.isEditing.set(true);
    this.newSinistro = {
      id_sinistro: sinistro.id_sinistro,
      numero_sinistro: sinistro.numero_sinistro,
      id_polizza: sinistro.id_polizza,
      data_sinistro: sinistro.data_sinistro,
      data_denuncia: sinistro.data_denuncia,
      luogo_sinistro: sinistro.luogo_sinistro || '',
      descrizione: sinistro.descrizione,
      id_tipo_sinistro: sinistro.id_tipo_sinistro,
      id_stato_sinistro: sinistro.id_stato_sinistro,
      importo_richiesto: sinistro.importo_richiesto || 0,
      importo_liquidato: sinistro.importo_liquidato || 0,
      data_chiusura: sinistro.data_chiusura || '',
      note: sinistro.note || '',
      id_operatore_assegnato: sinistro.id_operatore_assegnato || 0,
      priorita: sinistro.priorita,
      data_creazione: sinistro.data_creazione,
      data_modifica: sinistro.data_modifica
    };
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedSinistro.set(null);
  }

  saveSinistro() {
    if (this.isEditing()) {
      console.log('Updating sinistro:', this.newSinistro);
    } else {
      console.log('Creating new sinistro:', this.newSinistro);
    }
    this.closeModal();
    this.loadSinistri();
  }

  deleteSinistro(id: number) {
    if (confirm('Sei sicuro di voler eliminare questo sinistro?')) {
      console.log('Deleting sinistro:', id);
      this.loadSinistri();
    }
  }

  viewDetails(sinistro: SinistroView) {
    this.selectedSinistro.set(sinistro as any);
    console.log('Viewing details for:', sinistro);
  }

  getStatoBadgeClass(stato: string): string {
    switch (stato.toLowerCase()) {
      case 'aperto': return 'badge-danger';
      case 'in valutazione': return 'badge-info';
      case 'chiuso': return 'badge-success';
      case 'respinto': return 'badge-secondary';
      case 'sospeso': return 'badge-warning';
      default: return 'badge-light';
    }
  }

  getPrioritaBadgeClass(priorita: number): string {
    switch (priorita) {
      case 1: return 'badge-danger';  // Alta
      case 2: return 'badge-warning'; // Media
      case 3: return 'badge-success'; // Bassa
      default: return 'badge-light';
    }
  }

  getTipoBadgeClass(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'incidente stradale': return 'badge-danger';
      case 'furto': return 'badge-warning';
      case 'incendio': return 'badge-danger';
      case 'danni da acqua': return 'badge-info';
      case 'responsabilità civile': return 'badge-secondary';
      default: return 'badge-light';
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
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

  generateNumeroSinistro(): string {
    const year = new Date().getFullYear();
    const lastNumber = Math.max(...this.sinistri().map(s => {
      const match = s.numero_sinistro.match(/-(\d+)$/);
      return match ? parseInt(match[1]) : 0;
    }), 0);
    return `SIN-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
  }

  onGenerateNumero() {
    this.newSinistro.numero_sinistro = this.generateNumeroSinistro();
  }

  getDaysClass(giorni: number): string {
    if (giorni <= 7) return 'days-fresh';
    if (giorni <= 30) return 'days-normal';
    if (giorni <= 90) return 'days-old';
    return 'days-very-old';
  }
}