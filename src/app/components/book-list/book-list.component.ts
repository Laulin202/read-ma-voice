import { Component, OnInit, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { BookCardComponent } from '../book-card/book-card.component';
import { Book } from '../../services/books.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, BookCardComponent]
})
export class BookListComponent  implements OnInit {

  @Input() books: Book[] = [];
  @Input() showAsGrid: boolean = true;

  constructor() { }

  ngOnInit() {  }

  trackByFn(index: number, book: Book): number {
    return book.id;
  }


}
