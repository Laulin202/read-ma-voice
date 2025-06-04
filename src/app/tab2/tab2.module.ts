import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';

import { BookCardComponent } from '../components/book-card/book-card.component';
import { BookListComponent } from '../components/book-list/book-list.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    BookCardComponent,
    BookListComponent
  ],
  declarations: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab2PageModule {

}
