import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { CommonModule } from '@angular/common';  
import { IonicModule } from '@ionic/angular';  // Importar IonicModule para componentes ion-*
import { ScreenOrientation, OrientationLockType } from '@capacitor/screen-orientation';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.page.html',
  styleUrls: ['./reader.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],  // Importar módulos necesarios aquí
})
export class ReaderPage implements OnInit, OnDestroy {

  bookId!: number;
  pages: any[] = [];
  currentPageIndex: number = 0;  // Controla la página actual
  private originalOrientation: OrientationLockType | null = null;

  constructor(
    private route: ActivatedRoute,
    private booksService: BooksService,
    public platform: Platform
  ) {}

  async ngOnInit() {
    // Configurar orientación horizontal al entrar
    await this.setHorizontalOrientation();
    
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.bookId = +idParam; // conviértelo a número
        this.loadBookPages();
      }
    });
  }

  async ngOnDestroy() {
    // Restaurar orientación original al salir
    await this.restoreOrientation();
  }

  private async setHorizontalOrientation(): Promise<void> {
    try {
      // Solo aplicar en dispositivos móviles
      if (this.platform.is('capacitor')) {
        // Guardar orientación actual
        const currentOrientation = await ScreenOrientation.orientation();
        this.originalOrientation = currentOrientation.type;
        
        // Cambiar a orientación horizontal
        await ScreenOrientation.lock({ orientation: 'landscape' });
        console.log('Orientación cambiada a horizontal');
      }
    } catch (error) {
      console.error('Error al cambiar orientación:', error);
    }
  }

  private async restoreOrientation(): Promise<void> {
    try {
      if (this.platform.is('capacitor')) {
        // Restaurar orientación original o desbloquear
        if (this.originalOrientation) {
          await ScreenOrientation.lock({ orientation: this.originalOrientation });
        } else {
          // Si no tenemos orientación original, desbloqueamos para permitir cualquier orientación
          await ScreenOrientation.unlock();
        }
        console.log('Orientación restaurada');
      }
    } catch (error) {
      console.error('Error al restaurar orientación:', error);
    }
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

  // Método opcional para alternar orientación manualmente
  async toggleOrientation() {
    try {
      if (this.platform.is('capacitor')) {
        const current = await ScreenOrientation.orientation();
        if (current.type.includes('landscape')) {
          await ScreenOrientation.lock({ orientation: 'portrait' });
        } else {
          await ScreenOrientation.lock({ orientation: 'landscape' });
        }
      }
    } catch (error) {
      console.error('Error al alternar orientación:', error);
    }
  }

  // Método para manejar errores de carga de imágenes
  onImageError(event: any) {
    console.error('Error cargando imagen:', event);
    // Puedes establecer una imagen por defecto aquí si quieres
    // event.target.src = 'assets/images/placeholder.png';
  }
}