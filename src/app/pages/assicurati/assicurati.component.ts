import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssicuratoView, Assicurato } from '../../models/insurance.models';

@Component({
  selector: 'app-assicurati',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assicurati.component.html',
  styleUrls: ['./assicurati.component.css']
})
export class AssicuratiComponent implements OnInit {
  assicurati = signal<AssicuratoView[]>([]);
  filteredAssicurati = signal<AssicuratoView[]>([]);
  selectedAssicurato = signal<Assicurato | null>(null);
  isModalOpen = signal(false);
  isEditing = signal(false);
  searchTerm = signal('');
  filterAttivo = signal('all'); // 'all', 'active', 'inactive'

  newAssicurato: Assicurato = {
    id_assicurato: 0,
    codice_fiscale: '',
    nome: '',
    cognome: '',
    data_nascita: '',
    indirizzo: '',
    cap: '',
    citta: '',
    provincia: '',
    telefono: '',
    email: '',
    data_registrazione: '',
    attivo: true
  };

  ngOnInit() {
    this.loadAssicurati();
  }

  loadAssicurati() {
    // Mock data - in real app, this would come from a service
    const mockData: AssicuratoView[] = [
      {
        id_assicurato: 1,
        codice_fiscale: 'RSSMRA80A01H501Z',
        nome: 'Mario',
        cognome: 'Rossi',
        nome_completo: 'Mario Rossi',
        data_nascita: '1980-01-01',
        eta: 44,
        indirizzo: 'Via Roma 123',
        cap: '00100',
        citta: 'Roma',
        provincia: 'RM',
        indirizzo_completo: 'Via Roma 123, 00100 Roma (RM)',
        telefono: '3331234567',
        email: 'mario.rossi@email.com',
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
        indirizzo: 'Corso Italia 45',
        cap: '20100',
        citta: 'Milano',
        provincia: 'MI',
        indirizzo_completo: 'Corso Italia 45, 20100 Milano (MI)',
        telefono: '3337654321',
        email: 'giulia.bianchi@email.com',
        data_registrazione: '2023-02-20T14:15:00',
        attivo: true,
        numero_polizze: 3,
        polizze_attive: 3,
        numero_sinistri: 2,
        sinistri_aperti: 1
      }
    ];

    this.assicurati.set(mockData);
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.assicurati();

    // Filter by search term
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(a => 
        a.nome_completo.toLowerCase().includes(term) ||
        a.codice_fiscale.toLowerCase().includes(term) ||
        a.email?.toLowerCase().includes(term)
      );
    }

    // Filter by active status
    if (this.filterAttivo() !== 'all') {
      const isActive = this.filterAttivo() === 'active';
      filtered = filtered.filter(a => a.attivo === isActive);
    }

    this.filteredAssicurati.set(filtered);
  }

  onSearchChange(event: any) {
    this.searchTerm.set(event.target.value);
    this.applyFilters();
  }

  onFilterChange(event: any) {
    this.filterAttivo.set(event.target.value);
    this.applyFilters();
  }

  openCreateModal() {
    this.isEditing.set(false);
    this.newAssicurato = {
      id_assicurato: 0,
      codice_fiscale: '',
      nome: '',
      cognome: '',
      data_nascita: '',
      indirizzo: '',
      cap: '',
      citta: '',
      provincia: '',
      telefono: '',
      email: '',
      data_registrazione: '',
      attivo: true
    };
    this.isModalOpen.set(true);
  }

  openEditModal(assicurato: AssicuratoView) {
    this.isEditing.set(true);
    this.newAssicurato = {
      id_assicurato: assicurato.id_assicurato,
      codice_fiscale: assicurato.codice_fiscale,
      nome: assicurato.nome,
      cognome: assicurato.cognome,
      data_nascita: assicurato.data_nascita,
      indirizzo: assicurato.indirizzo || '',
      cap: assicurato.cap || '',
      citta: assicurato.citta || '',
      provincia: assicurato.provincia || '',
      telefono: assicurato.telefono || '',
      email: assicurato.email || '',
      data_registrazione: assicurato.data_registrazione,
      attivo: assicurato.attivo
    };
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedAssicurato.set(null);
  }

  saveAssicurato() {
    // Mock save - in real app, this would call a service
    if (this.isEditing()) {
      console.log('Updating assicurato:', this.newAssicurato);
    } else {
      console.log('Creating new assicurato:', this.newAssicurato);
    }
    this.closeModal();
    this.loadAssicurati(); // Reload data
  }

  deleteAssicurato(id: number) {
    if (confirm('Sei sicuro di voler eliminare questo assicurato?')) {
      console.log('Deleting assicurato:', id);
      this.loadAssicurati(); // Reload data
    }
  }

  viewDetails(assicurato: AssicuratoView) {
    this.selectedAssicurato.set(assicurato as any);
    // In a real app, this would navigate to a detail page or open a detail modal
    console.log('Viewing details for:', assicurato);
  }

  getStatusBadgeClass(attivo: boolean): string {
    return attivo ? 'badge-success' : 'badge-danger';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('it-IT');
  }
}