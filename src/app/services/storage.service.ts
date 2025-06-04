import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private _initialized = false;
  private initializing: Promise<void> | null = null;
  
  // Token como BehaviorSubject para poder suscribirse a cambios
  private _token = new BehaviorSubject<string | null>(null);

  // Agregamos un BehaviorSubject para el rol (opcional, si deseas suscribirte a cambios)
  private _role = new BehaviorSubject<string | null>(null);

  constructor(private storage: Storage) {
    this.init().catch(error => {
      console.error('Error durante la inicialización automática del storage:', error);
    });
  }

  async init(): Promise<void> {
    if (this._initialized) {
      return Promise.resolve();
    }
    if (this.initializing) {
      return this.initializing;
    }
    this.initializing = this.initializeStorage();
    try {
      await this.initializing;
      return;
    } catch (error) {
      this.initializing = null;
      throw error;
    }
  }
  
  private async initializeStorage(): Promise<void> {
    try {
      console.log('Inicializando storage...');
      if (!this.storage) {
        console.error('Storage is undefined or null');
        throw new Error('Storage is not available');
      }
      if (typeof this.storage.create !== 'function') {
        console.error('storage.create is not a function');
        this._storage = this.storage;
        this._initialized = true;
        console.log('Usando implementación alternativa de storage');
      } else {
        this._storage = await this.storage.create();
        this._initialized = true;
        console.log('Storage inicializado correctamente');
      }
      // Cargar token y rol al inicializar
      await this.loadTokenFromStorage();
      await this.loadRoleFromStorage();
    } catch (error) {
      console.error('Error al inicializar storage:', error);
      await this.initializeFallbackStorage();
    }
  }

  private async initializeFallbackStorage(): Promise<void> {
    console.log('Inicializando fallback storage...');
    this._storage = {
      get: async (key: string) => localStorage.getItem(key),
      set: async (key: string, value: any) => {
        localStorage.setItem(key, value);
        return value;
      },
      remove: async (key: string) => {
        localStorage.removeItem(key);
        return true;
      },
      clear: async () => {
        localStorage.clear();
        return true;
      },
      keys: async () => Object.keys(localStorage),
      length: async () => localStorage.length
    } as any;
    
    this._initialized = true;
    console.log('Fallback storage inicializado');
    await this.loadTokenFromStorage();
    await this.loadRoleFromStorage();
  }

  private async loadTokenFromStorage(): Promise<void> {
    try {
      let token: string | null = null;
      if (this._storage) {
        token = await this._storage.get('auth_cookie');
      }
      if (token) {
        console.log('Token recuperado durante la inicialización');
        this._token.next(token);
      } else {
        console.log('No se encontró token en el storage');
      }
    } catch (error) {
      console.error('Error al cargar token desde storage:', error);
    }
  }

  private async loadRoleFromStorage(): Promise<void> {
    try {
      let role: string | null = null;
      if (this._storage) {
        role = await this._storage.get('user_role');
      }
      if (role) {
        console.log('Rol recuperado durante la inicialización');
        this._role.next(role);
      } else {
        console.log('No se encontró rol en el storage');
      }
    } catch (error) {
      console.error('Error al cargar rol desde storage:', error);
    }
  }

  // Métodos para manejar el token
  async setCookie(value: string): Promise<void> {
    await this.ensureInitialized();
    try {
      if (!this._storage) {
        throw new Error('Storage no está disponible');
      }
      await this._storage.set('auth_cookie', value);
      this._token.next(value);
      console.log('Token guardado correctamente');
    } catch (error) {
      console.error('Error al guardar token:', error);
      try {
        localStorage.setItem('auth_cookie', value);
        this._token.next(value);
        console.log('Token guardado en localStorage como fallback');
      } catch (e) {
        console.error('Error fatal al guardar token en localStorage:', e);
        throw error;
      }
    }
  }

  getTokenObservable() {
    return this._token.asObservable();
  }

  getCurrentToken(): string | null {
    return this._token.getValue();
  }

  async getCookie(): Promise<string | null> {
    await this.ensureInitialized();
    try {
      let token = this._token.getValue();
      if (!token && this._storage) {
        token = await this._storage.get('auth_cookie') || null;
        if (token) {
          this._token.next(token);
          console.log('Token recuperado del storage');
        }
      }
      return token;
    } catch (error) {
      console.error('Error al recuperar token:', error);
      try {
        const token = localStorage.getItem('auth_cookie');
        if (token) {
          this._token.next(token);
          return token;
        }
      } catch (e) {
        console.error('Error al recuperar token desde localStorage:', e);
      }
      return null;
    }
  }

  async removeCookie(): Promise<void> {
    try {
      await this.ensureInitialized();
      if (this._storage) {
        await this._storage.remove('auth_cookie');
        this._token.next(null);
        console.log('Token eliminado correctamente');
      }
      try {
        localStorage.removeItem('auth_cookie');
      } catch (e) {
        console.warn('No se pudo limpiar localStorage:', e);
      }
    } catch (error) {
      console.error('Error al eliminar token:', error);
      try {
        localStorage.removeItem('auth_cookie');
        this._token.next(null);
        console.log('Token eliminado desde localStorage como fallback');
      } catch (e) {
        console.error('Error al eliminar token desde localStorage:', e);
        throw error;
      }
    }
  }

  // Métodos para manejar el rol
  async setRole(role: string): Promise<void> {
    await this.ensureInitialized();
    try {
      if (!this._storage) {
        throw new Error('Storage no está disponible');
      }
      await this._storage.set('user_role', role);
      this._role.next(role);
      console.log('Rol guardado correctamente');
    } catch (error) {
      console.error('Error al guardar rol:', error);
      try {
        localStorage.setItem('user_role', role);
        this._role.next(role);
        console.log('Rol guardado en localStorage como fallback');
      } catch (e) {
        console.error('Error fatal al guardar rol en localStorage:', e);
        throw error;
      }
    }
  }

async getRole(): Promise<string | null> {
  await this.ensureInitialized();
  try {
    const token = await this.getCookie();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log(payload?.role?.name);
      return payload?.role?.name || null;
    }

    
  } catch (e) {
    console.error('Error al obtener rol:', e);
  }
  return null;
}


  async removeRole(): Promise<void> {
    await this.ensureInitialized();
    try {
      if (this._storage) {
        await this._storage.remove('user_role');
        this._role.next(null);
        console.log('Rol eliminado correctamente');
      }
      try {
        localStorage.removeItem('user_role');
      } catch (e) {
        console.warn('No se pudo limpiar localStorage para rol:', e);
      }
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      try {
        localStorage.removeItem('user_role');
        this._role.next(null);
        console.log('Rol eliminado desde localStorage como fallback');
      } catch (e) {
        console.error('Error al eliminar rol desde localStorage:', e);
        throw error;
      }
    }
  }

  // Método de recuperación de token, opcional
  async attemptTokenRecovery(): Promise<string | null> {
    try {
      await this.ensureInitialized();
      if (!this._storage) {
        throw new Error('Storage no disponible para recuperación');
      }
      const token = await this._storage.get('auth_cookie');
      if (token) {
        this._token.next(token);
        console.log('Token recuperado en operación de emergencia');
      }
      return token;
    } catch (error) {
      console.error('Error en recuperación de emergencia:', error);
      try {
        const token = localStorage.getItem('auth_cookie');
        if (token) {
          console.log('Token recuperado desde localStorage (emergencia)');
          this._token.next(token);
          return token;
        }
      } catch (e) {
        console.error('Error al recuperar desde localStorage (emergencia):', e);
      }
      return null;
    }
  }

  async clearAll(): Promise<void> {
    try {
      await this.ensureInitialized();
      if (this._storage) {
        await this._storage.clear();
        this._token.next(null);
        this._role.next(null);
        console.log('Almacenamiento limpiado completamente');
      }
      try {
        localStorage.clear();
      } catch (e) {
        console.warn('No se pudo limpiar localStorage:', e);
      }
    } catch (error) {
      console.error('Error al limpiar storage:', error);
      try {
        localStorage.clear();
        this._token.next(null);
        this._role.next(null);
        console.log('Storage limpiado desde localStorage como fallback');
      } catch (e) {
        console.error('Error al limpiar localStorage:', e);
        throw error;
      }
    }
  }
  
  private async ensureInitialized(): Promise<void> {
    if (!this._initialized) {
      console.log('Storage no inicializado. Inicializando ahora...');
      await this.init();
    }
  }
}
