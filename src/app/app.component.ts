import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor() {
    this.showSplash();
  }
  async showSplash(){
    await SplashScreen.show({
      showDuration: 3000,
      autoHide: true,
    });
  }
}
