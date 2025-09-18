import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { produtos as PRODUTOS } from '../constants/produtos';

export interface Filtros {
  categoria?: string;
  precoMin?: number;
  precoMax?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private produtosOriginais = PRODUTOS;

  private buscaSubject = new BehaviorSubject<string>('');
  private filtrosSubject = new BehaviorSubject<Filtros>({});

  produtosFiltrados$ = combineLatest([
    this.buscaSubject,
    this.filtrosSubject
  ]).pipe(
    map(([busca, filtros]) => {
      let lista = this.produtosOriginais;

      if (busca) {
        lista = lista.filter(p =>
          p.nome.toLowerCase().includes(busca.toLowerCase())
        );
      }

      if (filtros.categoria) {
        lista = lista.filter(p => p.categoria === filtros.categoria);
      }

      if (filtros.precoMin != null) {
        lista = lista.filter(p => p.preco >= filtros.precoMin!);
      }
      if (filtros.precoMax != null) {
        lista = lista.filter(p => p.preco <= filtros.precoMax!);
      }

      return lista;
    })
  );

  get filtros$() {
    return this.filtrosSubject.asObservable();
  }

  get busca$() {
    return this.buscaSubject.asObservable();
  }

  setBusca(valor: string) {
    this.buscaSubject.next(valor);
  }

  setFiltros(filtros: Filtros) {
    this.filtrosSubject.next(filtros);
  }

  limparFiltros() {
    this.filtrosSubject.next({});
  }

  getFiltrosAtivosCount(filtros: Filtros): number {
    return Object.values(filtros).filter(v => v !== undefined && v !== '').length;
  }

  getCategorias(): string[] {
    return Array.from(new Set(this.produtosOriginais.map(p => p.categoria).filter(Boolean)));
  }
}
