import { Injectable } from '@angular/core';

@Injectable()
export class ObjectService {
  public getPropertyValue(object: object, property: string): any {
    const props = property.toString().split('.');
    let val = object;
    props.forEach(prop => {
      if (!val) {
        return val;
      }
      val = val[prop];
    });
    return val;
  }

  public setPropertyValue(object: object, property: string, value: any) {
    const props = property.toString().split('.');
    let val = object;
    props.forEach((prop, index) => {
      if (!val) {
        throw new Error(`No such property in Object`);
      }
      if (index !== props.length - 1) {
        val = val[prop];
      } else {
        val[prop] = value;
      }
    });
  }
}
