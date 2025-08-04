import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperatoreView, Operatore, RuoloOperatore } from '../../models/insurance.models';

@Component({
  selector: 'app-operatori',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './operatori.component.html',
  styleUrls: ['./operatori.component.css']
})
export class OperatoriComponent implements OnInit {
  operatori = signal<OperatoreView[]>([]);
  filteredOperatori = signal<OperatoreView[]>([]);
  ruoli = signal<RuoloOperatore[]>([]);
  selectedOperatore = signal<Operatore | null>(null);
  isModalOpen = signal(false);
  isEditing = signal(false);
  searchTerm = signal('');
  filterRuolo = signal('all');
  filterStato = signal('all'); // 'all', 'active', 'inactive'

  newOperatore: Operatore = {
    id_operatore: 0,
    codice_operatore: '',
    nome: '',
    cognome: '',
    id_ruolo_operatore: 1,
    telefono: '',
    email: '',
    data_assunzione: '',
    data_cessazione: '',
    attivo: true
  };

  ngOnInit() {
    this.loadRuoli();
    this.loadOperatori();
  }

  loadRuoli() {
    // Mock data - in real app, this would come from a service
    const mockRuoli: RuoloOperatore[] = [
      { id_ruolo_operatore: 1, codice: 'PERITO', descrizione: 'Perito', livello_autorizzazione: 2, attivo: true, ordinamento: 1 },
      { id_ruolo_operatore: 2, codice: 'LIQUIDATORE', descrizione: 'Liquidatore', livello_autorizzazione: 3, attivo: true, ordinamento: 2 },
      { id_ruolo_operatore: 3, codice: 'ISPETTORE', descrizione: 'Ispettore', livello_autorizzazione: 2, attivo: true, ordinamento: 3 },
      { id_ruolo_operatore: 4, codice: 'MANAGER', descrizione: 'Manager', livello_autorizzazione: 4, attivo: true, ordinamento: 4 }
    ];
    this.ruoli.set(mockRuoli);
  }

  loadOperatori() {
    // Mock data - in real app, this would come from a service
    const mockData: OperatoreView[] = [
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
        telefono: '3331112233',
        email: 'marco.verdi@assicurazioni.com',
        data_assunzione: '2020-03-15',
        data_cessazione: undefined,
        stato_operatore: 'ATTIVO',
        attivo: true,
        sinistri_assegnati: 15,
        sinistri_aperti: 5,
        perizie_effettuate: 23,
        importo_medio_perizie: 8500.00
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
        telefono: '3334445566',
        email: 'laura.neri@assicurazioni.com',
        data_assunzione: '2019-01-10',
        data_cessazione: undefined,
        stato_operatore: 'ATTIVO',
        attivo: true,
        sinistri_assegnati: 32,
        sinistri_aperti: 8,
        perizie_effettuate: 45,
        importo_medio_perizie: 12300.00
      },
      {
        id_operatore: 3,
        codice_operatore: 'OP003',
        nome: 'Giuseppe',
        cognome: 'Bruno',
        nome_completo: 'Giuseppe Bruno',
        id_ruolo_operatore: 4,
        ruolo: 'Manager',
        codice_ruolo: 'MANAGER',
        livello_autorizzazione: 4,
        telefono: '3337778899',
        email: 'giuseppe.bruno@assicurazioni.com',
        data_assunzione: '2018-05-20',
        data_cessazione: '2023-12-31',
        stato_operatore: 'CESSATO',
        attivo: false,
        sinistri_assegnati: 0,
        sinistri_aperti: 0,
        perizie_effettuate: 0,
        importo_medio_perizie: 0
      }
    ];

    this.operatori.set(mockData);
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.operatori();

    // Filter by search term
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(o => 
        o.nome_completo.toLowerCase().includes(term) ||
        o.codice_operatore.toLowerCase().includes(term) ||
        o.email.toLowerCase().includes(term) ||
        o.ruolo.toLowerCase().includes(term)
      );
    }

    // Filter by role
    if (this.filterRuolo() !== 'all') {
      const ruoloId = parseInt(this.filterRuolo());
      filtered = filtered.filter(o => o.id_ruolo_operatore === ruoloId);
    }

    // Filter by active status
    if (this.filterStato() !== 'all') {
      const isActive = this.filterStato() === 'active';
      filtered = filtered.filter(o => o.attivo === isActive);
    }

    this.filteredOperatori.set(filtered);
  }

  onSearchChange(event: any) {
    this.searchTerm.set(event.target.value);
    this.applyFilters();
  }

  onRuoloFilterChange(event: any) {
    this.filterRuolo.set(event.target.value);
    this.applyFilters();
  }

  onStatoFilterChange(event: any) {
    this.filterStato.set(event.target.value);
    this.applyFilters();
  }

  openCreateModal() {
    this.isEditing.set(false);
    this.newOperatore = {
      id_operatore: 0,
      codice_operatore: '',
      nome: '',
      cognome: '',
      id_ruolo_operatore: 1,
      telefono: '',
      email: '',
      data_assunzione: '',
      data_cessazione: '',
      attivo: true
    };
    this.isModalOpen.set(true);
  }

  openEditModal(operatore: OperatoreView) {
    this.isEditing.set(true);
    this.newOperatore = {
      id_operatore: operatore.id_operatore,
      codice_operatore: operatore.codice_operatore,
      nome: operatore.nome,
      cognome: operatore.cognome,
      id_ruolo_operatore: operatore.id_ruolo_operatore,
      telefono: operatore.telefono || '',
      email: operatore.email,
      data_assunzione: operatore.data_assunzione || '',
      data_cessazione: operatore.data_cessazione || '',
      attivo: operatore.attivo
    };
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedOperatore.set(null);
  }

  saveOperatore() {
    // Mock save - in real app, this would call a service
    if (this.isEditing()) {
      console.log('Updating operatore:', this.newOperatore);
    } else {
      console.log('Creating new operatore:', this.newOperatore);
    }
    this.closeModal();
    this.loadOperatori(); // Reload data
  }

  deleteOperatore(id: number) {
    if (confirm('Sei sicuro di voler eliminare questo operatore?')) {
      console.log('Deleting operatore:', id);
      this.loadOperatori(); // Reload data
    }
  }

  viewDetails(operatore: OperatoreView) {
    this.selectedOperatore.set(operatore as any);
    console.log('Viewing details for:', operatore);
  }

  getStatusBadgeClass(attivo: boolean): string {
    return attivo ? 'badge-success' : 'badge-danger';
  }

  getRuoleBadgeClass(ruolo: string): string {
    switch (ruolo.toLowerCase()) {
      case 'manager': return 'badge-primary';
      case 'liquidatore': return 'badge-info';
      case 'perito': return 'badge-secondary';
      case 'ispettore': return 'badge-warning';
      default: return 'badge-light';
    }
  }

  getWorkloadClass(sinistri_aperti: number): string {
    if (sinistri_aperti === 0) return 'workload-none';
    if (sinistri_aperti <= 3) return 'workload-low';
    if (sinistri_aperti <= 7) return 'workload-medium';
    return 'workload-high';
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('it-IT');
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '-';
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  generateCodiceOperatore(): string {
    const lastOperatore = this.operatori().slice(-1)[0];
    const lastNumber = lastOperatore ? parseInt(lastOperatore.codice_operatore.slice(2)) : 0;
    return `OP${String(lastNumber + 1).padStart(3, '0')}`;
  }

  onGenerateCodice() {
    this.newOperatore.codice_operatore = this.generateCodiceOperatore();
  }
}