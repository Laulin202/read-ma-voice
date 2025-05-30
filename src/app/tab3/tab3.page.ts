import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
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
      titulo: 'Caperucita Roja',
      descripcion: 'Cuento clásico infantil',
      img: 'https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg'
    },
    {
      titulo: 'El patito feo',
      descripcion: 'Historia de superación',
      img: 'https://images.pexels.com/photos/2086361/pexels-photo-2086361.jpeg'
    },
    {
      titulo: 'Los tres cochinitos',
      descripcion: 'Aventura y perseverancia',
      img: 'https://images.pexels.com/photos/3662845/pexels-photo-3662845.jpeg'
    },
    {
      titulo: 'Cenicienta',
      descripcion: 'Cuento de hadas',
      img: 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg'
    },
    {
      titulo: 'Rapunzel',
      descripcion: 'Torre y cabello mágico',
      img: 'https://images.pexels.com/photos/3662845/pexels-photo-3662845.jpeg'
    },
    {
      titulo: 'Pinocho',
      descripcion: 'El títere que quería ser real',
      img: 'https://images.pexels.com/photos/3662844/pexels-photo-3662844.jpeg'
    },
    {
      titulo: 'Blancanieves',
      descripcion: 'Los siete enanitos',
      img: 'https://images.pexels.com/photos/2465877/pexels-photo-2465877.jpeg'
    },
    {
      titulo: 'Hansel y Gretel',
      descripcion: 'Casa de dulces',
      img: 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg'
    }
  ];

}
