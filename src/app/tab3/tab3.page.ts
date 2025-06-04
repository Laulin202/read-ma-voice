import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BookCardComponent } from '../components/book-card/book-card.component';
import { BooksService, Book } from '../services/books.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BookCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab3Page implements OnInit, OnDestroy {
  books: Book[] = [];
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
    const booksSubscription = this.booksService.filteredBooks$.subscribe({
      next: (books) => {
        this.books = books;
      },
      error: (error) => {
        console.error('Error loading books:', error);
      }
    });

    this.subscription.add(booksSubscription);
  }

  onBookClick(book: Book) {
    console.log('Book clicked:', book);
    // this.router.navigate(['/book-detail', book.id]);
  }

  trackByBookId(index: number, book: Book): number {
    return book.id;
  }
}
