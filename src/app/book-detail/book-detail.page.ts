import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, combineLatest} from 'rxjs';
import { switchMap, catchError, filter, take } from 'rxjs/operators';

import { BooksService, Book } from '../services/books.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.page.html',
  styleUrls: ['./book-detail.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BookDetailPage implements OnInit {
  book$: Observable<Book | undefined>;
  bookId: number = 0;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private booksService: BooksService
  ) {
    // Inicializar el observable
    this.book$ = of(undefined);
  }

  ngOnInit() {
    this.loadBookDetail();
  }

   private loadBookDetail(): void {
    // Esperar a que los libros estén cargados Y obtener el ID de la ruta
    this.book$ = combineLatest([
      this.route.paramMap,
      this.booksService.booksLoaded$.pipe(filter(loaded => loaded)) // Solo continuar cuando los libros estén cargados
    ]).pipe(
      switchMap(([params, booksLoaded]) => {
        const id = params.get('id');
        if (id && booksLoaded) {
          this.bookId = parseInt(id, 10);
          console.log('Buscando libro con ID:', this.bookId);
          return this.booksService.getBookByIdAsync(this.bookId);
        }
        return of(undefined);
      }),
      catchError(error => {
        console.error('Error loading book detail:', error);
        this.isLoading = false;
        return of(undefined);
      })
    );

    // Suscribirse para controlar el estado de carga
    this.book$.subscribe(book => {
      this.isLoading = false;
      if (book) {
        console.log('Libro encontrado:', book);
      } else {
        console.log('Libro no encontrado con ID:', this.bookId);
      }
    });
  }

  getAgeColor(age: string): string {
    if (age.includes('+4')) {
      return '#8141e6'; // morado
    } else if (age.includes('+3')) {
      return '#ea832e'; // naranja
    } else {
      return '#CCCCCC'; // color por defecto
    }
  }

  goBack(): void {
    this.router.navigate(['/tabs/tab1']); // o la ruta que corresponda
  }

  // Método para manejar el caso de libro no encontrado
  onBookNotFound(): void {
    console.log('Libro no encontrado');
    this.goBack();
  }

}
