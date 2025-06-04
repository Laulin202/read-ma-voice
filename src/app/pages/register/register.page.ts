import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HeroesBDService } from '../../services/heroes-bd.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage implements OnInit {

  nombre: string = '';
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

  ngOnInit() {}

  async presentToast(message: string, color: 'success' | 'danger' = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }

  registrar() {
    if (!this.nombre || !this.email || !this.password) {
      this.presentToast('Por favor completa todos los campos');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Llamar al servicio register (con nombre, email y contraseña)
    this.heroesBDService.register(this.nombre, this.email, this.password).subscribe({
      next: async (response: any) => {
        this.loading = false;
        if (response && response.token) {
          // Si tu backend devuelve token al registrar, guárdalo:
          await this.storageService.setCookie(response.token);
          this.presentToast('Registro exitoso', 'success');
          this.router.navigate(['/tabs']);
        } else {
          // Si no devuelve token (lo común), solo notificamos y enviamos al login:
          this.presentToast('Registro exitoso, por favor inicia sesión', 'success');
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error en registro:', err);
        this.presentToast('Error al registrar usuario', 'danger');
      }
    });
  }
  
  goToHome() {
    this.router.navigate(['/login']);
  }
}
