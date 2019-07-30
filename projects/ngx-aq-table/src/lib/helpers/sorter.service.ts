import { Injectable } from '@angular/core';
import { ObjectService } from './object.service';
import { By } from '../models/sort-by';

@Injectable()
export class SorterService {
  constructor(
    private objectService: ObjectService
  ) { }

  public sort(data: any[], by: By) {
    const propVal = data.filter(x => this.objectService.getPropertyValue(x, by.property));
    if (propVal.length > 0) {
      const type = typeof this.objectService.getPropertyValue(propVal[0], by.property);
      switch (type) {
        case 'string':
          this.byString(data, by);
          break;
        case 'number':
          this.byNumber(data, by);
          break;
        case 'object':
          this.byObject(data, by);
          break;
        default:
          console.error(`Cannot sort by '${type}' type.`);
      }
    }
  }

  private byString(data: any[], by: By) {
    if (by.order === 'asc') {
      data.sort((a, b) => {
        const aVal = `${this.objectService.getPropertyValue(a, by.property)}`;
        const bVal = `${this.objectService.getPropertyValue(b, by.property)}`;
        return 0 - (aVal.toLowerCase() > bVal.toLowerCase() ? 1 : -1);
      });
    } else if (by.order === 'desc') {
      data.sort((a, b) => {
        const aVal = `${this.objectService.getPropertyValue(a, by.property)}`;
        const bVal = `${this.objectService.getPropertyValue(b, by.property)}`;
        return 0 - (aVal.toLowerCase() < bVal.toLowerCase() ? 1 : -1);
      });
    }
  }

  private byNumber(data: any[], by: By) {
    if (by.order === 'asc') {
      data.sort((a, b) => {
        const aProp = this.objectService.getPropertyValue(a, by.property) ? this.objectService.getPropertyValue(a, by.property) : 0;
        const bProp = this.objectService.getPropertyValue(b, by.property) ? this.objectService.getPropertyValue(b, by.property) : 0;
        return 0 - (aProp - bProp > 0 ? 1 : -1);
      });
    } else if (by.order === 'desc') {
      data.sort((a, b) => {
        const aProp = this.objectService.getPropertyValue(a, by.property) ? this.objectService.getPropertyValue(a, by.property) : 0;
        const bProp = this.objectService.getPropertyValue(b, by.property) ? this.objectService.getPropertyValue(b, by.property) : 0;
        return 0 - (aProp - bProp < 0 ? 1 : -1);
      });
    }
  }

  private byObject(data: any[], by: By) {
    if (by.order === 'asc') {
      data.sort((a, b) => {
        const aProp = this.objectService.getPropertyValue(a, by.property) ? this.objectService.getPropertyValue(a, by.property) : 0;
        const bProp = this.objectService.getPropertyValue(b, by.property) ? this.objectService.getPropertyValue(b, by.property) : 0;
        return 0 - (aProp - bProp > 0 ? 1 : -1);
      });
    } else if (by.order === 'desc') {
      data.sort((a, b) => {
        const aProp = this.objectService.getPropertyValue(a, by.property) ? this.objectService.getPropertyValue(a, by.property) : 0;
        const bProp = this.objectService.getPropertyValue(b, by.property) ? this.objectService.getPropertyValue(b, by.property) : 0;
        return 0 - (aProp - bProp < 0 ? 1 : -1);
      });
    }
  }
}
