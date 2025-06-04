import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { URL_HEROES } from '../config/url.servicios';
import { Observable, catchError, map, throwError, tap, of, switchMap, from } from 'rxjs';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HeroesBDService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) { }


  /**
   * Verifica si el usuario está autenticado
   * @returns Promise con el estado de autenticación
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.storageService.getCookie();
      return !!token; // Convierte a booleano (true si hay token, false si no)
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return false;
    }
  }

  /**
   * Obtiene los headers de autenticación para las peticiones
   * @returns Observable con los headers
   */
  private getAuthHeaders(): Observable<HttpHeaders> {
    return from(this.storageService.getCookie()).pipe(
      map(token => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
        });
        
        if (token) {
          console.log('Añadiendo token a la petición');
          return headers.set('x-token', token);
        } else {
          console.warn('No hay token disponible para la petición');
        }
        
        return headers;
      }),
      catchError(error => {
        console.error('Error al obtener headers de autenticación:', error);
        // Devolver headers sin token si hay error
        return of(new HttpHeaders({
          'Content-Type': 'application/json'
        }));
      })
    );
  }

  /**
   * Realiza el login del usuario
   * @param user email del usuario
   * @param pass Contraseña del usuario
   * @returns Observable con la respuesta del servidor
   */
  login(user: string, pass: string): Observable<any> {
    const url = `${URL_HEROES}/auth/login`;
    const body = {
      email: user,
      password: pass
    };

    return this.http.post(url, body).pipe(
      tap((response: any) => {
        console.log('Respuesta de login recibida', response);
      }),
      switchMap((response: any) => {
        if (response && response.token && response.user && response.user.role) {
          // Guardar el token y el rol en el almacenamiento
          return from(
            Promise.all([
              this.storageService.setCookie(response.token),
              this.storageService.setRole(response.user.role) // 👈 nuevo
            ])
          ).pipe(
            map(() => response)
          );
        } else {
          console.warn('Faltan datos en la respuesta del login');
          return of(response);
        }
      }),
      catchError((error) => {
        console.error('Error en la petición de login:', error);
        return this.handleError(error);
      })
    );
  }

register(username: string, email: string, password: string): Observable<any> {
  const url = `${URL_HEROES}/users`;  // Asegúrate que URL_HEROES tenga la ruta base correcta
  const body = {
    username,  // <-- este debe llamarse así si el backend espera 'username'
    email,
    password,
    role: "683e8488a4106e439bb4f3f5"  // <-- renombrado de 'rol' a 'role'
  };

  return this.http.post(url, body).pipe(
    tap(response => {
      console.log('Respuesta de registro recibida', response);
    }),
    catchError(error => {
      console.error('Error en la petición de registro:', error);
      return this.handleError(error);
    })
  );
}

  /**
   * Guarda el token en el almacenamiento
   * @param token Token de autenticación
   * @returns Observable que completa cuando se guarda el token
   */
  private saveToken(token: string): Observable<void> {
    return from(this.storageService.setCookie(token)).pipe(
      tap(() => console.log('Token guardado correctamente')),
      catchError(error => {
        console.error('Error al guardar token:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): Observable<void> {
    return from(this.storageService.removeCookie()).pipe(
      tap(() => {
        console.log('Token eliminado correctamente');
        // Redirigir al usuario a la página de login o inicio
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Error al cerrar sesión:', error);
        // Intentar redirigir de todos modos
        this.router.navigate(['/login']);
        return of(undefined);
      })
    );
  }

  /**
   * Maneja los errores HTTP
   * @param error Error HTTP
   * @returns Observable con el error
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error de red: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
      
      // Verificar si es un error de autenticación
      if (error.status === 401) {
        errorMessage = 'No autorizado: La sesión ha expirado o no tienes permisos.';
        // Manejar el error de autenticación
        this.handleAuthError();
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Maneja errores de autenticación
   */
  private handleAuthError() {
    console.log('Manejando error de autenticación');
    // Remover token de forma segura y redirigir
    this.storageService.removeCookie()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Error al eliminar token durante manejo de error de autenticación:', error);
        // Intentar redirigir de todos modos
        this.router.navigate(['/login']);
      });
  }
}