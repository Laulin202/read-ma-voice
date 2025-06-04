
export interface Heroe {
  _id?: string;
  nombre: string;
  bio: string;
  aparicion: string;
  casa: string;
  img: string[] | string;
}


//Generado por la IA, pasandole el JSON  
export  interface Personaje {
    _id: string;
    nombre: string;
    bio: string;
    img: string[] | string; 
    aparicion: string; // ISO date string
    casa: string;
  }

export interface Site {
  _id: string;
  name: string;
  description?: string;
  city: City;
  type: { id: string; name: string };
  image?: string;
  isFavorite?: boolean;
}

export interface Country {
  _id?: string;         // Transformado desde _id
  name: string;        // Nombre del país
  code: string;        // Código del país (ISO, en mayúsculas)
  image?: string;      // URL de imagen (bandera, mapa, etc.)
  status?: boolean;    // Estado (activo/inactivo)
  createdAt?: string;  // Timestamp de creación
  updatedAt?: string;  // Timestamp de actualización
}


export interface City {
  _id?: string;
  name: string;
  country: string | Country;  // Puede ser solo el id o un objeto Country
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
}
export interface Celebrity {
  _id?: string;
  fullName: string;
  birthCity: string | City;   // Puede ser string o City
  category: string | Category; // Puede ser string o Category
  image?: string;
  status?: boolean;
}

export interface Dish {
  _id?: string;
  name: string;
  description?: string;
  cityOfOrigin: string; // puede ser el ID o un objeto populado
  status?: boolean;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}
