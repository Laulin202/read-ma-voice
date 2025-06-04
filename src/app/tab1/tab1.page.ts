import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BookCardComponent } from '../components/book-card/book-card.component';
import { BookListComponent } from '../components/book-list/book-list.component';
import { BooksService, Book } from '../services/books.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Tab1Page implements OnInit, OnDestroy {
  books: Book[] = [];
  recentBooks: Book[] = [];
  recommendedBooks: Book[] = [];
  private subscription: Subscription = new Subscription();

  slideOpts = {
    slidesPerView: 2,
    spaceBetween: 30,
    freeMode: false,
    grabCursor: true,
    centeredSlides: false,
    loop: false,
    autoplay: false,
    slidesPerGroup: 2,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  constructor(private booksService: BooksService) {}

  ngOnInit() {
    this.loadBooks();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadBooks() {
    // Opción 1: Usar filteredBooks$ que se actualiza automáticamente
    const booksSubscription = this.booksService.filteredBooks$.subscribe({
      next: (books) => {
        this.books = books;
        this.setupBookSections();
      },
      error: (error) => {
        console.error('Error loading books:', error);
      }
    });
    
    this.subscription.add(booksSubscription);

    // Opción 2: También puedes suscribirte a booksLoaded$ para saber cuando están listos
    const loadedSubscription = this.booksService.booksLoaded$.subscribe(loaded => {
      if (loaded) {
        console.log('Books are loaded and ready');
      }
    });
    
    this.subscription.add(loadedSubscription);
  }

  private setupBookSections() {
    // Para "Seguir leyendo" - puedes implementar lógica específica
    // Por ahora mostramos los primeros 4 libros
    this.recentBooks = this.books.slice(0, 4);
    
    // Para "Recomendaciones" - mostramos libros restantes o todos mezclados
    this.recommendedBooks = this.books.slice(2, 6);
  }

  onBookClick(book: Book) {
    console.log('Book clicked:', book);
    // Aquí puedes implementar la navegación al detalle del libro
    // this.router.navigate(['/book-detail', book.id]);
  }

  trackByBookId(index: number, book: Book): number {
    return book.id;
  }
}