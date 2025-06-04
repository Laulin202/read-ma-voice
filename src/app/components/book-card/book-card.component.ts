import { Component, OnInit, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { Book } from '../../services/books.service';
@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class BookCardComponent  implements OnInit {

  @Input() id!: number;  // ¡Nuevo input para el ID!
  
  @Input() imageSrc!: string;
  @Input() title!: string;
  @Input() icon!: string;
  @Input() age!: string;
  @Input() theme!: string;
  @Input() description!: string;


  getAgeColor(): string {
    if (this.age.includes('+4')) {
      return '#8141e6'; // morado
    } else if (this.age.includes('+3')) {
      return '#ea832e'; // verde
    } else {
      return '#CCCCCC'; // color por defecto
    }
  }

  goToBookDetail() {
  console.log('ID recibido:', this.id); // Para debug
  this.router.navigate(['/book-detail', this.id]);
}

  constructor(private router:Router) { }

  ngOnInit(){
  }

}
