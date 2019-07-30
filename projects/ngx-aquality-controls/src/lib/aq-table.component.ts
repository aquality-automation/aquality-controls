import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { ObjectService } from './helpers/object.service';
import { faSync, faCaretDown, faCaretUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SorterService } from './helpers/sorter.service';
import { By } from './models/sort-by';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AQColumn } from './models/aq-table-column';

@Component({
  selector: 'aq-table',
  templateUrl: 'aq-table.component.html',
  styleUrls: ['aq-table.component.scss', './styles.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: '0', opacity: '0' }),
        animate('200ms ease-in', style({ height: 'auto', opacity: '1' }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ height: '0', opacity: '0' }))
      ])
    ]),
    trigger('filter', [
      transition(':enter', [
        style({
          transform: 'translateY(-10%)',
          opacity: 0
        }),
        animate('.5s ease-in-out', style({
          transform: 'translateY(0)',
          opacity: 1
        }))
      ]),
      transition(':leave', [
        animate('.5s ease-in-out', style({
          transform: 'translateY(-10%)',
          opacity: 0
        }))
      ]),
      state('*', style({})),
    ])
  ]
})
export class AQTableComponent implements OnChanges {
  constructor(
    private objectService: ObjectService,
    private sorterService: SorterService,
    private route: ActivatedRoute,
    private router: Router,
    public datepipe: DatePipe
  ) { }

  @Input() data: any[];
  @Input() columnsToShow: AQColumn[];
  @Input() columnsToHide: AQColumn[] = [];
  @Input() tableName = 'Magic Table';
  @Input() queryParams = true;

  @Output() errorText = new EventEmitter();
  @Output() dataChange = new EventEmitter();
  @Output() rowClick = new EventEmitter();
  @Output() updateRequest = new EventEmitter();
  @Output() shownData = new EventEmitter();

  fa = { faSync, faCaretDown, faCaretUp };
  editMode = false;
  filterMode = false;
  columnsManagement = false;
  filteredData: any[];
  sortCaret: IconDefinition = this.fa.faCaretDown;
  appliedFilters: any[] = [];

  ngOnChanges() {
    if (this.data) {
      this.filteredData = this.data.slice();
      this.applyFilters();
    }
  }

  sort($event: By) {
    this.sortCaret = $event.order === 'desc'
      ? this.fa.faCaretUp
      : this.fa.faCaretDown;
    this.sorterService.sort(this.filteredData, $event);
  }

  isLookup(type: string): boolean {
    if (type) {
      return type === 'lookup' || type === 'autocomplete' || type === 'multiselect';
    }
    return false;
  }

  isDate(type: string): boolean {
    if (type) {
      return type === 'date';
    }
    return false;
  }

  rowClicked(entity) {
    if (!this.editMode) {
      this.rowClick.emit(entity);
    }
  }

  getData(object: object, column: AQColumn, convertToText: boolean = true) {
    const value = this.getPropertyValue(object, column.property);
    if (!convertToText) {
      return value;
    }
    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleString();
      case 'string':
        return value;
      case 'number':
        return +value;
      case 'lookup':
      case 'autocomplete':
      case 'multiselect':
        return this.textToShow(value, column.lookup.propertiesToShow);
      default:
        return value;
    }
  }

  private getPropertyValue(object: object, property: string): any {
    return this.objectService.getPropertyValue(object, property);
  }

  private textToShow(item, propertiesToShow): string {
    if (item) {
      let textToShow = '';
      if (propertiesToShow) {
        propertiesToShow.forEach(property => {
          const props = property.split('.');
          let itemValue = item;
          props.forEach(prop => {
            if (!itemValue) {
              return '';
            }
            itemValue = itemValue[prop];
          });
          if (typeof itemValue === 'number') { itemValue = this.datepipe.transform(new Date(itemValue), 'yyyy-MM-dd hh:mm:ss a'); }
          textToShow = `${textToShow} ${itemValue}`;
        });
      } else {
        textToShow = item;
      }
      return textToShow.trim();
    }
    return '';
  }

  private setPropertyValue(object: object, property: string, value: any) {
    this.objectService.setPropertyValue(object, property, value);
  }

  updateData(object: object, column: AQColumn, $event: any) {
    this.setPropertyValue(object, column.property, $event);
    this.dataChange.emit({ object, column, value: $event });
  }

  onError($event) {
    this.errorText.emit($event);
  }

  toggleEditMode($event: boolean) {
    this.editMode = $event;
  }

  toggleFilterMode($event: boolean) {
    this.filterMode = $event;
  }

  toggleCMMode($event: boolean) {
    this.columnsManagement = $event;
  }

  update() {
    this.updateRequest.emit();
  }

  textFilterData(property) {
    const filter = this.appliedFilters.find(x => x.property === property);
    return filter ? filter.value : '';
  }

  handleFilterChange(col, $event) {
    this.appliedFilters = this.appliedFilters.filter(x => x.property !== col.property);
    const filter = { property: col.property, value: $event };
    this.appliedFilters.push(filter);
    this.setParams(filter);
  }

  setParams(filter) {
    if (this.queryParams) {
      const queryParam = {};
      if (filter.value) {
        queryParam[`f_${filter.property}`] = filter.value;
      } else if (filter.from || filter.to) {
        filter.from ? queryParam[`f_${filter.property}_from`] =
          new Date(filter.from).toISOString() : queryParam[`f_${filter.property}_from`] = '';
        filter.to ? queryParam[`f_${filter.property}_to`] = new Date(filter.to).toISOString() : queryParam[`f_${filter.property}_to`] = '';
      } else if (filter.options) {
        queryParam[`f_${filter.property}_opt`] = filter.options;
      } else if (filter.range) {
        queryParam[`f_${filter.property}_rng`] = filter.range;
      } else {
        this.route.queryParams.subscribe(params => {
          const filterKeys = Object.keys(params);
          filterKeys.forEach(key => {
            if (!key.includes(filter.property)) {
              queryParam[key] = params[key];
            } else {
              queryParam[key] = '';
            }
          });
        });
      }
      this.router.navigate([], { queryParams: queryParam, queryParamsHandling: 'merge' }).then(() => this.applyFilters());
    }
  }

  readParams() {
    if (this.queryParams) {
      this.route.queryParams.subscribe(params => {
        const filterKeys = Object.keys(params);
        this.appliedFilters = this.appliedFilters.filter(x => false);
        filterKeys.forEach(param => {
          if (param.startsWith('f_')) {
            this.readParam(params, param);
          }
        });
      });
    }
  }

  readParam(params, param) {
    if (param.endsWith('_from')) {
      const newString = param;
      const match = newString.match(/f_(.+)_from/)[1];
      let filter = this.appliedFilters.find(x => x.property === match);
      if (!filter) {
        filter = { property: match };
      }
      filter.from = params[param];
      this.appliedFilters.push(filter);
    } else if (param.endsWith('_to')) {
      const prop = param.match(/f_(.*)_to/)[1];
      let filter = this.appliedFilters.find(x => x.property === prop);
      if (!filter) {
        filter = { property: prop };
      }
      filter.to = params[param];
      this.appliedFilters.push(filter);
    } else if (param.endsWith('_opt')) {
      const prop = param.match(/f_(.*)_opt/)[1];
      let filter = this.appliedFilters.find(x => x.property === prop);
      if (!filter) {
        filter = { property: prop };
      }
      filter.options = params[param];
      this.appliedFilters.push(filter);
    } else if (param.endsWith('_rng')) {
      const prop = param.match(/f_(.*)_rng/)[1];
      let filter = this.appliedFilters.find(x => x.property === prop);
      if (!filter) {
        filter = { property: prop };
      }
      filter.range = params[param];
      this.appliedFilters.push(filter);
    } else {
      const prop = param.match(/f_(.*)/)[1];
      this.appliedFilters.push({ property: prop, value: params[param] });
    }
  }

  applyFilters() {
    if (this.queryParams) {
      this.readParams();
      this.filteredData = this.data;
      this.appliedFilters.forEach(element => {
        this.filteredData = this.fitData(this.filteredData, element);
      });
    }
    this.shownData.emit(this.filteredData);
  }

  fitData(data: any[], filter) {
    if (filter.property !== '' && filter.value !== '') {
      if (filter.hasOwnProperty('value')) {
        return data.filter(x => {
          const val = this.getPropertyValue(x, filter.property);
          if (val) {
            if (val.hasOwnProperty('text')) {
              return val.text.toString().toLowerCase().includes(filter.value.toLowerCase());
            }
            return val.toString().toLowerCase().includes(filter.value.toLowerCase());
          }
          return false;
        });
      } else if (filter.hasOwnProperty('from') || filter.hasOwnProperty('to')) {
        return this.filterDate(data, filter);
      } else if (filter.hasOwnProperty('options')) {
        return this.filterMS(data, filter);
      } else if (filter.hasOwnProperty('range')) {
        return this.filterRange(data, filter);
      } else {
        return data;
      }
    } else { return data; }
  }

  filterMS(filteredData, filter) {
    let data = filteredData;
    if (filter.options) {
      const selectedOpts: any[] = filter.options.split(',');
      data = filteredData.filter(x => {
        const propertyValue = this.getPropertyValue(x, filter.property);
        if (propertyValue) {
          if (Array.isArray(propertyValue)) {
            return selectedOpts.some(y => propertyValue.find(z => z.id === +y));
          } else {
            return selectedOpts.every(y => propertyValue.id === +y);
          }
        }
        return selectedOpts.some(y => y === 'null');
      });
    }

    return data;
  }

  filterRange(filteredData, filter) {
    let data = filteredData;
    if (filter.range) {
      const ranges = filter.range.split(',');
      data = filteredData.filter(x => (ranges[0] ? +ranges[0] <= x[filter.property] : true)
        && (ranges[1] ? x[filter.property] <= +ranges[1] : true));
    }
    return data;
  }

  filterDate(data: any[], filter) {
    const from = filter.from;
    const to = filter.to;
    if (!from && !to) {
      return data;
    }

    return data.filter(x => {
      const val = this.getPropertyValue(x, filter.property);
      if (val) {
        if (from && to) {
          return new Date(from) <= new Date(val) && new Date(val) <= new Date(to);
        } else if (from) {
          return new Date(from) <= new Date(val);
        } else {
          return new Date(val) <= new Date(to);
        }
      }
      return false;
    });
  }
}
