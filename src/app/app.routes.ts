import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/assicurati', pathMatch: 'full' },
  { 
    path: 'assicurati', 
    loadComponent: () => import('./pages/assicurati/assicurati.component').then(m => m.AssicuratiComponent) 
  },
  { 
    path: 'operatori', 
    loadComponent: () => import('./pages/operatori/operatori.component').then(m => m.OperatoriComponent) 
  },
  { 
    path: 'polizze', 
    loadComponent: () => import('./pages/polizze/polizze.component').then(m => m.PolizzeComponent) 
  },
  { 
    path: 'sinistri', 
    loadComponent: () => import('./pages/sinistri/sinistri.component').then(m => m.SinistriComponent) 
  },
  { 
    path: 'perizie', 
    loadComponent: () => import('./pages/perizie/perizie.component').then(m => m.PerizieComponent) 
  }
];
