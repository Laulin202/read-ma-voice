import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  slideOpts = {
    slidesPerView: 2,      // Exactamente 2 slides por vista
    spaceBetween: 30,      // Aumenté la distancia entre cards
    freeMode: false,
    grabCursor: true,
    centeredSlides: false,
    loop: false,
    autoplay: false,
    slidesPerGroup: 2,     // Mueve 2 slides por swipe
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  constructor() {}
}