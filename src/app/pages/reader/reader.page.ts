import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { CommonModule } from '@angular/common';  
import { IonicModule } from '@ionic/angular';  // Importar IonicModule para componentes ion-*

@Component({
  selector: 'app-reader',
  templateUrl: './reader.page.html',
  styleUrls: ['./reader.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],  // Importar módulos necesarios aquí
})
export class ReaderPage implements OnInit {

  bookId!: number;
  pages: any[] = [];
  currentPageIndex: number = 0;  // Controla la página actual

  constructor(
    private route: ActivatedRoute,
    private booksService: BooksService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.bookId = +idParam; // conviértelo a número
        this.loadBookPages();
      }
    });
  }

  loadBookPages() {
    this.booksService.getBookByIdAsync(this.bookId).subscribe(book => {
      console.log('Libro recibido:', book);
      if (book && book.pages && book.pages.length > 0) {
        this.pages = book.pages;
        this.currentPageIndex = 0;  // Reinicia al primer página cuando carga nuevo libro
        console.log('Páginas cargadas:', this.pages);
      } else {
        this.pages = [];
        console.warn('Libro o páginas no encontrados o vacíos');
      }
    });
  }

  get currentPage() {
    return this.pages.length > 0 ? this.pages[this.currentPageIndex] : null;
  }

  nextPage() {
    if (this.currentPageIndex < this.pages.length - 1) {
      this.currentPageIndex++;
    }
  }

  prevPage() {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
    }
  }
}
