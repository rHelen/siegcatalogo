import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.scss'
})
export class CarrinhoComponent implements OnInit, OnChanges {
  @Input() aberto = false;
  @Input() tipo: 'carrinho' | 'favoritos' = 'carrinho';
  @Output() fechar = new EventEmitter<void>();

  itens: any[] = [];
  total = 0;

  ngOnInit() {
    this.carregarItens();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['aberto']?.currentValue || changes['tipo']) {
      this.carregarItens();
    }
  }

  carregarItens() {
    if (!this.aberto) return;
    const key = this.tipo === 'carrinho' ? 'carrinho' : 'favoritos';
    const dados = localStorage.getItem(key);
    this.itens = dados ? JSON.parse(dados) : [];
    this.calcularTotal();
  }

  calcularTotal() {
    if (this.tipo === 'carrinho') {
      this.total = this.itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    }
  }

  alterarQuantidade(item: any, delta: number) {
    item.quantidade += delta;
    if (item.quantidade < 1) item.quantidade = 1;
    this.salvar();
  }

  removerItem(item: any) {
    this.itens = this.itens.filter(i => i.id !== item.id);
    this.salvar();
  }

  salvar() {
    const key = this.tipo === 'carrinho' ? 'carrinho' : 'favoritos';
    localStorage.setItem(key, JSON.stringify(this.itens));
    this.calcularTotal();
  }

  fecharModal() {
    this.fechar.emit();
  }
}
