import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
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

  constructor() {}

}