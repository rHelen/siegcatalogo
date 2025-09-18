import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatalogoService, Filtros } from './../core/services/catalogo.service';
import { CommonModule } from '@angular/common';
import { FiltroComponent } from './filtro/filtro.component';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { CarrinhoComponent } from './carrinho/carrinho.component';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'route-home',
  standalone: true,
  imports: [CommonModule, FiltroComponent, CarrinhoComponent, MatDialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  produtos$ = this.catalogoService.produtosFiltrados$;
  categorias: string[] = [];
  filtros: Filtros = {};
  filtrosAtivos = 0;

  private buscaSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  modalAberto = false;
  modalTipo: 'carrinho' | 'favoritos' = 'carrinho';

  constructor(private catalogoService: CatalogoService) {}

  ngOnInit() {
    this.categorias = this.catalogoService.getCategorias();

    this.catalogoService.filtros$.pipe(takeUntil(this.destroy$)).subscribe(filtros => {
      this.filtros = filtros;
      this.filtrosAtivos = this.catalogoService.getFiltrosAtivosCount(filtros);
    });

    this.buscaSubject.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(valor => {
      this.catalogoService.setBusca(valor);
    });
  }

  onBusca(event: Event) {
    const valor: string | any = (event.target as HTMLInputElement).value || undefined;
    this.buscaSubject.next(valor);
  }

  onFiltrosChange(filtros: Filtros) {
    this.catalogoService.setFiltros(filtros);
  }

  limparFiltros() {
    this.catalogoService.limparFiltros();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  abrirModal(tipo: 'carrinho' | 'favoritos') {
    this.modalTipo = tipo;
    this.modalAberto = true;
  }
  fecharModal() {
    this.modalAberto = false;
  }

  adicionarAoCarrinho(produto: any) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    const idx = carrinho.findIndex((p: any) => p.id === produto.id);
    if (idx > -1) {
      carrinho[idx].quantidade += 1;
    } else {
      carrinho.push({ ...produto, quantidade: 1 });
    }
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }
  adicionarAosFavoritos(produto: any) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    if (!favoritos.find((p: any) => p.id === produto.id)) {
      favoritos.push(produto);
      localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }
  }
}
