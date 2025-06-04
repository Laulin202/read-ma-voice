import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface Page {
  id: number;
  text: string;
  imageUrl: string;
}


export interface Book {
  id: number;
  imageSrc: string;
  title: string;
  icon: string;
  age: string;
  theme: string;
  description: string;
  category: string;
  pages: Page[];
}

interface BooksData {
  books: Book[];
}

@Injectable({
  providedIn: 'root'
})

export class BooksService {
  
  private books: Book[] = [];
  private filteredBooksSubject = new BehaviorSubject<Book[]>([]);
  public filteredBooks$ = this.filteredBooksSubject.asObservable();

  // BehaviorSubject para controlar el estado de carga
  private booksLoadedSubject = new BehaviorSubject<boolean>(false);
  public booksLoaded$ = this.booksLoadedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadBooksFromJson();
  }

private loadBooksFromJson(): void {
  this.http.get<BooksData>('assets/data/books.json')
    .pipe(
      map(data => data.books),
      tap(books => {
        console.log('Libros cargados con pages:', JSON.parse(JSON.stringify(books))); 
        this.books = books;
        this.filteredBooksSubject.next(books);
        this.booksLoadedSubject.next(true);
      }),
      catchError(error => {
        console.error('Error loading books:', error);
        return of([]);
      })
    )
    .subscribe();
}


  // Método para recargar los datos si es necesario
  reloadBooks(): Observable<Book[]> {
    return this.http.get<BooksData>('assets/data/books.json')
      .pipe(
        map(data => data.books),
        tap(books => {
          this.books = books;
          this.filteredBooksSubject.next(books);
          this.booksLoadedSubject.next(true);
        }),
        catchError(error => {
          console.error('Error reloading books:', error);
          return of([]);
        })
      );
  }

  getAllBooks(): Book[] {
    return [...this.books];
  }

  // Método asíncrono para obtener todos los libros
  getAllBooksAsync(): Observable<Book[]> {
    if (this.books.length > 0) {
      return of([...this.books]);
    }

    return this.http.get<BooksData>('assets/data/books.json')
      .pipe(
        map(data => data.books),
        catchError(error => {
          console.error('Error getting books:', error);
          return of([]);
        })
      );
  }

  getBooksByCategory(category: string): Book[] {
    return this.books.filter(book => book.category === category);
  }

  // Método asíncrono para obtener libros por categoría
  getBooksByCategoryAsync(category: string): Observable<Book[]> {
    if (this.books.length > 0) {
      return of(this.books.filter(book => book.category === category));
    }

    return this.getAllBooksAsync().pipe(
      map(books => books.filter(book => book.category === category))
    );
  }

  filterBooks(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredBooksSubject.next(this.books);
      return;
    }

    const filtered = this.books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.theme.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.filteredBooksSubject.next(filtered);
  }

  resetFilter(): void {
    this.filteredBooksSubject.next(this.books);
  }

  // Método para obtener un libro específico por ID
  getBookById(id: number): Book | undefined {
    return this.books.find(book => book.id === id);
  }

  // Método asíncrono para obtener un libro por ID
  getBookByIdAsync(id: number): Observable<Book | undefined> {
    if (this.books.length > 0) {
      return of(this.books.find(book => book.id === id));
    }

    return this.getAllBooksAsync().pipe(
      map(books => books.find(book => book.id === id))
    );
  }

  // Método para obtener todas las categorías únicas
  getCategories(): string[] {
    const categories = this.books.map(book => book.category);
    return [...new Set(categories)];
  }

  // Método asíncrono para obtener categorías
  getCategoriesAsync(): Observable<string[]> {
    return this.getAllBooksAsync().pipe(
      map(books => {
        const categories = books.map(book => book.category);
        return [...new Set(categories)];
      })
    );
  }
}