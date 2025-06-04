import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BookCardComponent } from '../components/book-card/book-card.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BookCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab3Page {
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

  constructor() { }

  cuentos = [
    {
      title: 'Caperucita Roja',
      description: 'Cuento clásico infantil',
      imageSrc: 'https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg',
      icon: 'logo-ionic',
      age: '+4 años',
      theme: 'Clásicos'
    },
    {
      title: 'El patito feo',
      description: 'Historia de superación',
      imageSrc: 'https://images.pexels.com/photos/2086361/pexels-photo-2086361.jpeg',
      icon: 'logo-ionic',
      age: '+3 años',
      theme: 'Fábulas'
    },
    {
      title: 'Los tres cochinitos',
      description: 'Aventura y perseverancia',
      imageSrc: 'https://images.pexels.com/photos/3662845/pexels-photo-3662845.jpeg',
      icon: 'logo-ionic',
      age: '+3 años',
      theme: 'Clásicos'
    },
    // ...agrega el resto de cuentos igual
  ];

}
