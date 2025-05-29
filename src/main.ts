import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

//  Importas register desde Swiper
import { register } from 'swiper/element/bundle';

//  Ejecutas el registro de los Web Components
register();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
