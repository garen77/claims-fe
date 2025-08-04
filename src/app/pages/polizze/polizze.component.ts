import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PolizzaView, Polizza, TipoPolizza, StatoPolizza, AssicuratoView } from '../../models/insurance.models';

@Component({
  selector: 'app-polizze',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './polizze.component.html',
  styleUrls: ['./polizze.component.css']
})
export class PolizzeComponent implements OnInit {
  polizze = signal<PolizzaView[]>([]);
  filteredPolizze = signal<PolizzaView[]>([]);
  tipiPolizza = signal<TipoPolizza[]>([]);
  statiPolizza = signal<StatoPolizza[]>([]);
  assicurati = signal<AssicuratoView[]>([]);
  selectedPolizza = signal<Polizza | null>(null);
  isModalOpen = signal(false);
  isEditing = signal(false);
  searchTerm = signal('');
  filterTipo = signal('all');
  filterStato = signal('all');
  filterScadenza = signal('all'); // 'all', 'valide', 'in_scadenza', 'scadute'

  newPolizza: Polizza = {
    id_polizza: 0,
    numero_polizza: '',
    id_assicurato: 0,
    id_tipo_polizza: 1,
    data_inizio: '',
    data_scadenza: '',
    premio_annuale: 0,
    id_stato_polizza: 1,
    massimale: 0,
    franchigia: 0,
    data_creazione: '',
    data_modifica: ''
  };

  ngOnInit() {
    this.loadTipiPolizza();
    this.loadStatiPolizza();
    this.loadAssicurati();
    this.loadPolizze();
  }

  loadTipiPolizza() {
    const mockTipi: TipoPolizza[] = [
      { id_tipo_polizza: 1, codice: 'AUTO', descrizione: 'Polizza Auto', attivo: true, ordinamento: 1 },
      { id_tipo_polizza: 2, codice: 'CASA', descrizione: 'Polizza Casa', attivo: true, ordinamento: 2 },
      { id_tipo_polizza: 3, codice: 'VITA', descrizione: 'Polizza Vita', attivo: true, ordinamento: 3 },
      { id_tipo_polizza: 4, codice: 'SALUTE', descrizione: 'Polizza Salute', attivo: true, ordinamento: 4 },
      { id_tipo_polizza: 5, codice: 'RC', descrizione: 'Responsabilità Civile', attivo: true, ordinamento: 5 }
    ];
    this.tipiPolizza.set(mockTipi);
  }

  loadStatiPolizza() {
    const mockStati: StatoPolizza[] = [
      { id_stato_polizza: 1, codice: 'ATTIVA', descrizione: 'Attiva', attivo: true, ordinamento: 1 },
      { id_stato_polizza: 2, codice: 'SOSPESA', descrizione: 'Sospesa', attivo: true, ordinamento: 2 },
      { id_stato_polizza: 3, codice: 'SCADUTA', descrizione: 'Scaduta', attivo: true, ordinamento: 3 },
      { id_stato_polizza: 4, codice: 'ANNULLATA', descrizione: 'Annullata', attivo: true, ordinamento: 4 }
    ];
    this.statiPolizza.set(mockStati);
  }

  loadAssicurati() {
    const mockAssicurati: AssicuratoView[] = [
      {
        id_assicurato: 1,
        codice_fiscale: 'RSSMRA80A01H501Z',
        nome: 'Mario',
        cognome: 'Rossi',
        nome_completo: 'Mario Rossi',
        data_nascita: '1980-01-01',
        eta: 44,
        data_registrazione: '2023-01-15T10:30:00',
        attivo: true,
        numero_polizze: 2,
        polizze_attive: 2,
        numero_sinistri: 1,
        sinistri_aperti: 0
      },
      {
        id_assicurato: 2,
        codice_fiscale: 'BNCGNA85B15F205W',
        nome: 'Giulia',
        cognome: 'Bianchi',
        nome_completo: 'Giulia Bianchi',
        data_nascita: '1985-02-15',
        eta: 39,
        data_registrazione: '2023-02-20T14:15:00',
        attivo: true,
        numero_polizze: 3,
        polizze_attive: 3,
        numero_sinistri: 2,
        sinistri_aperti: 1
      }
    ];
    this.assicurati.set(mockAssicurati);
  }

  loadPolizze() {
    // Mock data
    const mockData: PolizzaView[] = [
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
        massimale: 50000.00,
        franchigia: 500.00,
        data_creazione: '2024-01-10T09:00:00',
        data_modifica: '2024-01-10T09:00:00',
        numero_sinistri: 1,
        totale_liquidato: 2500.00,
        percentuale_utilizzo: 5.0
      },
      {
        id_polizza: 2,
        numero_polizza: 'CASA-2024-002',
        id_assicurato: 1,
        assicurato: 'Mario Rossi',
        codice_fiscale: 'RSSMRA80A01H501Z',
        id_tipo_polizza: 2,
        tipo_polizza: 'Polizza Casa',
        codice_tipo_polizza: 'CASA',
        data_inizio: '2024-03-01',
        data_scadenza: '2025-03-01',
        stato_scadenza: 'VALIDA',
        premio_annuale: 1200.00,
        id_stato_polizza: 1,
        stato_polizza: 'Attiva',
        codice_stato_polizza: 'ATTIVA',
        massimale: 150000.00,
        franchigia: 1000.00,
        data_creazione: '2024-02-25T14:30:00',
        data_modifica: '2024-02-25T14:30:00',
        numero_sinistri: 0,
        totale_liquidato: 0,
        percentuale_utilizzo: 0
      },
      {
        id_polizza: 3,
        numero_polizza: 'AUTO-2023-015',
        id_assicurato: 2,
        assicurato: 'Giulia Bianchi',
        codice_fiscale: 'BNCGNA85B15F205W',
        id_tipo_polizza: 1,
        tipo_polizza: 'Polizza Auto',
        codice_tipo_polizza: 'AUTO',
        data_inizio: '2023-12-01',
        data_scadenza: '2024-09-15',
        stato_scadenza: 'SCADUTA',
        premio_annuale: 920.00,
        id_stato_polizza: 3,
        stato_polizza: 'Scaduta',
        codice_stato_polizza: 'SCADUTA',
        massimale: 75000.00,
        franchigia: 750.00,
        data_creazione: '2023-11-25T16:00:00',
        data_modifica: '2024-09-16T10:00:00',
        numero_sinistri: 2,
        totale_liquidato: 8500.00,
        percentuale_utilizzo: 11.33
      }
    ];

    this.polizze.set(mockData);
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.polizze();

    // Filter by search term
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(p => 
        p.numero_polizza.toLowerCase().includes(term) ||
        p.assicurato.toLowerCase().includes(term) ||
        p.codice_fiscale.toLowerCase().includes(term) ||
        p.tipo_polizza.toLowerCase().includes(term)
      );
    }

    // Filter by tipo
    if (this.filterTipo() !== 'all') {
      const tipoId = parseInt(this.filterTipo());
      filtered = filtered.filter(p => p.id_tipo_polizza === tipoId);
    }

    // Filter by stato
    if (this.filterStato() !== 'all') {
      const statoId = parseInt(this.filterStato());
      filtered = filtered.filter(p => p.id_stato_polizza === statoId);
    }

    // Filter by scadenza
    if (this.filterScadenza() !== 'all') {
      filtered = filtered.filter(p => p.stato_scadenza.toLowerCase() === this.filterScadenza());
    }

    this.filteredPolizze.set(filtered);
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

  onScadenzaFilterChange(event: any) {
    this.filterScadenza.set(event.target.value);
    this.applyFilters();
  }

  openCreateModal() {
    this.isEditing.set(false);
    this.newPolizza = {
      id_polizza: 0,
      numero_polizza: '',
      id_assicurato: 0,
      id_tipo_polizza: 1,
      data_inizio: '',
      data_scadenza: '',
      premio_annuale: 0,
      id_stato_polizza: 1,
      massimale: 0,
      franchigia: 0,
      data_creazione: '',
      data_modifica: ''
    };
    this.isModalOpen.set(true);
  }

  openEditModal(polizza: PolizzaView) {
    this.isEditing.set(true);
    this.newPolizza = {
      id_polizza: polizza.id_polizza,
      numero_polizza: polizza.numero_polizza,
      id_assicurato: polizza.id_assicurato,
      id_tipo_polizza: polizza.id_tipo_polizza,
      data_inizio: polizza.data_inizio,
      data_scadenza: polizza.data_scadenza,
      premio_annuale: polizza.premio_annuale,
      id_stato_polizza: polizza.id_stato_polizza,
      massimale: polizza.massimale || 0,
      franchigia: polizza.franchigia || 0,
      data_creazione: polizza.data_creazione,
      data_modifica: polizza.data_modifica
    };
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedPolizza.set(null);
  }

  savePolizza() {
    if (this.isEditing()) {
      console.log('Updating polizza:', this.newPolizza);
    } else {
      console.log('Creating new polizza:', this.newPolizza);
    }
    this.closeModal();
    this.loadPolizze();
  }

  deletePolizza(id: number) {
    if (confirm('Sei sicuro di voler eliminare questa polizza?')) {
      console.log('Deleting polizza:', id);
      this.loadPolizze();
    }
  }

  viewDetails(polizza: PolizzaView) {
    this.selectedPolizza.set(polizza as any);
    console.log('Viewing details for:', polizza);
  }

  getStatoBadgeClass(stato: string): string {
    switch (stato.toLowerCase()) {
      case 'attiva': return 'badge-success';
      case 'sospesa': return 'badge-warning';
      case 'scaduta': return 'badge-danger';
      case 'annullata': return 'badge-secondary';
      default: return 'badge-light';
    }
  }

  getScadenzaBadgeClass(statoScadenza: string): string {
    switch (statoScadenza.toLowerCase()) {
      case 'valida': return 'badge-success';
      case 'in_scadenza': return 'badge-warning';
      case 'scaduta': return 'badge-danger';
      default: return 'badge-light';
    }
  }

  getTipoBadgeClass(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'polizza auto': return 'badge-primary';
      case 'polizza casa': return 'badge-info';
      case 'polizza vita': return 'badge-success';
      case 'polizza salute': return 'badge-warning';
      case 'responsabilità civile': return 'badge-secondary';
      default: return 'badge-light';
    }
  }

  getUtilizzoBadgeClass(percentuale: number): string {
    if (percentuale === 0) return 'utilizzo-none';
    if (percentuale <= 10) return 'utilizzo-low';
    if (percentuale <= 30) return 'utilizzo-medium';
    return 'utilizzo-high';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('it-IT');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  generateNumeroPolizza(): string {
    const tipo = this.tipiPolizza().find(t => t.id_tipo_polizza === this.newPolizza.id_tipo_polizza);
    const year = new Date().getFullYear();
    const lastNumber = Math.max(...this.polizze().map(p => {
      const match = p.numero_polizza.match(/-(\d+)$/);
      return match ? parseInt(match[1]) : 0;
    }), 0);
    return `${tipo?.codice || 'POL'}-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
  }

  onGenerateNumero() {
    this.newPolizza.numero_polizza = this.generateNumeroPolizza();
  }

  onTipoChange() {
    if (!this.isEditing()) {
      this.newPolizza.numero_polizza = this.generateNumeroPolizza();
    }
  }
}