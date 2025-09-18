import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Filtros } from '../../core/services/catalogo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filtro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filtro.component.html',
  styleUrl: './filtro.component.scss'
})
export class FiltroComponent {
  @Input() categorias: string[] = [];
  @Input() filtros: Filtros = {};
  @Output() filtrosChange = new EventEmitter<Filtros>();

  onCategoriaChange(event: Event) {
    const categoria = (event.target as HTMLInputElement).value || undefined;
    this.filtrosChange.emit({ ...this.filtros, categoria });
  }

  onPrecoMinChange(event: Event) {
    const precoMin = (event.target as HTMLInputElement).value || undefined;
    this.filtrosChange.emit({ ...this.filtros, precoMin: precoMin ? +precoMin : undefined });
  }

  onPrecoMaxChange(event: Event) {
    const precoMax = (event.target as HTMLInputElement).value || undefined;
    this.filtrosChange.emit({ ...this.filtros, precoMax: precoMax ? +precoMax : undefined });
  }
}
