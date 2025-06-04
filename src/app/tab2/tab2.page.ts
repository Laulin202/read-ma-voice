import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { BookCardComponent } from '../components/book-card/book-card.component';
import { BookListComponent } from '../components/book-list/book-list.component';
import { BooksService, Book } from '../services/books.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BookCardComponent, BookListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab2Page implements OnInit, OnDestroy {

  // Variables para la búsqueda
  searchTerm: string = '';
  showSearchResults: boolean = false;
  filteredBooks: Book[] = [];
  classicBooks: Book[] = [];

  adventureBooks: Book[] = [];
  
   // Variables para el estado de carga
  isLoading: boolean = true;
  loadError: boolean = false;
  
  private searchSubscription?: Subscription;
  private booksLoadedSubscription?: Subscription;

  // Tu configuración de swiper existente
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
    // Suscribirse al estado de carga de libros
    this.booksLoadedSubscription = this.booksService.booksLoaded$.subscribe(
      (loaded: boolean) => {
        if (loaded) {
          this.isLoading = false;
          this.loadBooks();
        }
      }
    );

    // Suscribirse a los cambios en los libros filtrados
    this.searchSubscription = this.booksService.filteredBooks$.subscribe(
      (books: Book[]) => {
        this.filteredBooks = books;
      }
    );
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.booksLoadedSubscription) {
      this.booksLoadedSubscription.unsubscribe();
    }
  }

   private loadBooks() {
    try {
      // Obtener libros por categoría para las secciones fijas
      this.classicBooks = this.booksService.getBooksByCategory('Clásicos');
      this.adventureBooks = this.booksService.getBooksByCategory('Aventura');
      
      this.loadError = false;
    } catch (error) {
      console.error('Error loading books:', error);
      this.loadError = true;
      this.isLoading = false;
    }
  }

  onSearchInput(event: any) {
    const searchTerm = event.target.value;
    this.searchTerm = searchTerm;
    
    if (searchTerm && searchTerm.trim() !== '') {
      this.showSearchResults = true;
      this.booksService.filterBooks(searchTerm);
    } else {
      this.showSearchResults = false;
      this.booksService.resetFilter();
    }
  }

  onSearchClear() {
    this.searchTerm = '';
    this.showSearchResults = false;
    this.booksService.resetFilter();
  }

  trackByBookId(index: number, book: Book): number {
    return book.id;
  }

  // Método para recargar datos en caso de error
  retryLoading() {
    this.isLoading = true;
    this.loadError = false;
    
    this.booksService.reloadBooks().subscribe({
      next: (books) => {
        this.loadBooks();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error reloading books:', error);
        this.loadError = true;
        this.isLoading = false;
      }
    });
  }

}
