import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HeroesBDService } from '../../services/heroes-bd.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private heroesBDService: HeroesBDService,
    private storageService: StorageService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.checkExistingToken();
  }

  async checkExistingToken() {
    const token = await this.storageService.getCookie();
    if (token) {
      console.log('Token encontrado. Redirigiendo...');
      this.router.navigate(['/tabs']);
    }
  }

  async login() {
    if (!this.email || !this.password) {
      this.presentToast('Completa todos los campos', 'warning');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.heroesBDService.login(this.email, this.password).subscribe({
      next: async (response) => {
        if (response && response.token) {
          console.log('Login exitoso, token:', response.token);
          const savedToken = await this.storageService.getCookie();

          if (savedToken) {
            this.presentToast('Login exitoso', 'success');
            this.router.navigate(['/tabs']);
          } else {
            this.presentToast('Error al guardar el token', 'danger');
          }
        } else {
          this.presentToast('Credenciales inválidas', 'danger');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.presentToast('Error de autenticación', 'danger');
        this.loading = false;
      }
    });
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    toast.present();
  }
}
