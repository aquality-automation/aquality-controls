import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AQTableModule } from 'projects/ngx-aq-table/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AQTableModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
