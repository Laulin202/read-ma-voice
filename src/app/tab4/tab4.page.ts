import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeroesBDService } from '../services/heroes-bd.service';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab4Page implements OnInit {

  constructor(
    private heroesBDService: HeroesBDService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit() {
  }

async logout() {
  this.heroesBDService.logout().subscribe({
    next: () => {
      console.log('Logout exitoso y navegación realizada');
    },
    error: (err) => {
      console.error('Error en logout:', err);
    }
  });
}
}
