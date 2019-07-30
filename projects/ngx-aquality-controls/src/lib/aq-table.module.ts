import { NgModule } from '@angular/core';
import { AQTableComponent } from './aq-table.component';
import { AQColumnsManagementComponent } from './aq-columns-management/aq-columns-management.component';
import { AQButtonComponent } from './aq-button/aq-button.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SetClassDirective } from './directives/set-class.directive';
import { TableSorterDirective } from './directives/sorter.directive';
import { FormsModule } from '@angular/forms';
import { AQInlineInputComponent } from './aq-inline-input/aq-inline-input.component';
import { AQLookupComponent } from './aq-lookup/aq-lookup.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClickOutsideModule } from 'ng-click-outside';
import { ObjectService } from './helpers/object.service';
import { SorterService } from './helpers/sorter.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatchWidthDirective } from './directives/col-width.directive';
import { DataHeightDirective } from './directives/data-holder-height.directive';

@NgModule({
  declarations: [
    AQTableComponent,
    AQColumnsManagementComponent,
    AQButtonComponent,
    SetClassDirective,
    TableSorterDirective,
    MatchWidthDirective,
    DataHeightDirective,
    AQInlineInputComponent,
    AQLookupComponent
  ],
  providers: [
    ObjectService,
    SorterService,
    DatePipe
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    DragDropModule,
    ClickOutsideModule,
    BrowserAnimationsModule
  ],
  exports: [
    AQTableComponent,
    AQButtonComponent,
    AQInlineInputComponent,
    AQLookupComponent
  ]
})
export class AQTableModule { }
