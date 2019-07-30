import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AQTableComponent } from './aq-table.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AQColumnsManagementComponent } from './aq-columns-management/aq-columns-management.component';
import { AQButtonComponent } from './aq-button/aq-button.component';
import { SetClassDirective } from './directives/set-class.directive';
import { TableSorterDirective } from './directives/sorter.directive';
import { MatchWidthDirective } from './directives/col-width.directive';
import { DataHeightDirective } from './directives/data-holder-height.directive';
import { AQInlineInputComponent } from './aq-inline-input/aq-inline-input.component';
import { AQLookupComponent } from './aq-lookup/aq-lookup.component';
import { CommonModule, DatePipe } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClickOutsideModule } from 'ng-click-outside';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ObjectService } from './helpers/object.service';
import { SorterService } from './helpers/sorter.service';
import { ActivatedRoute, Router, Data, Params } from '@angular/router';

describe('AQTableComponent', () => {
  let component: AQTableComponent;
  let fixture: ComponentFixture<AQTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FontAwesomeModule,
        FormsModule,
        DragDropModule,
        ClickOutsideModule,
        BrowserAnimationsModule
      ],
      providers: [
        ObjectService,
        SorterService,
        DatePipe,
        {
          provide: Router,
          useClass: class { navigate = jasmine.createSpy("navigate"); }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            data: {
              subscribe: (fn: (value: Data) => void) => fn({
                company: 'COMPANY',
              }),
            },
            params: {
              subscribe: (fn: (value: Params) => void) => fn({
                tab: 0,
              }),
            },
            queryParams: {
              subscribe: (fn: (value: Params) => void) => fn({
                tab: 0,
              }),
            },
            snapshot: {
              url: [
                {
                  path: 'foo',
                },
                {
                  path: 'bar',
                },
                {
                  path: 'baz',
                },
              ],
            },
          }
        }
      ],
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
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AQTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.data = [{ name: 'test 1' }, { name: 'test 2' }];
    component.columnsToShow = [{ name: 'Name', filter: false, property: 'name', sorting: true, type: 'string', editable: false }];
  });

  it('Table should be created', () => {
    expect(component).toBeTruthy();
  });

  it('On Data change this data should appear in filtered Data', () => {
    component.data = [{ name: 'test 1' }, { name: 'test 2' }];
    component.ngOnChanges();
    expect(component.filteredData).toEqual(component.data);
  });

  it('Sorting should work fine for asc', () => {
    component.data = [{ name: 'test 1' }, { name: 'test 2' }];
    component.ngOnChanges();
    component.sort({ property: 'name', order: 'asc' });
    expect(component.filteredData).toEqual([{ name: 'test 2' }, { name: 'test 1' }]);
    component.sort({ property: 'name', order: 'desc' });
    expect(component.filteredData).toEqual([{ name: 'test 1' }, { name: 'test 2' }]);
  });

  it('Sorting should work fine for desc', () => {
    component.data = [{ name: 'test 2' }, { name: 'test 1' }];
    component.ngOnChanges();
    component.sort({ property: 'name', order: 'desc' });
    expect(component.filteredData).toEqual([{ name: 'test 1' }, { name: 'test 2' }]);
  });

  it('isLookup method should show lookups', () => {
    expect(component.isLookup('lookup')).toBe(true);
    expect(component.isLookup('autocomplete')).toBe(true);
    expect(component.isLookup('multiselect')).toBe(true);
    expect(component.isLookup('lookup 1')).toBe(false);
  });

  it('isDate method should show lookups', () => {
    expect(component.isDate('date')).toBe(true);
    expect(component.isDate('date 1')).toBe(false);
  });

  it('Row Clicked method emits rowClick', () => {
    component.data = [{ name: 'test 2' }, { name: 'test 1' }];
    component.ngOnChanges();
    spyOn(component.rowClick, 'emit');
    component.rowClick.subscribe((value) => row = value);
    component.rowClicked({ name: 'test 1' });
    expect(component.rowClick.emit).toHaveBeenCalled();
    expect(row).toEqual({ name: 'test 1' });
  });
});
