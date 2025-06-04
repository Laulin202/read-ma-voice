import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
  
})
export class RegisterPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToHome(){
    this.router.navigate(['/tabs']);
  }

}
