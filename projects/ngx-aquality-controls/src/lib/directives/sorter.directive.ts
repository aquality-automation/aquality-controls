import {
  Directive, ElementRef, AfterViewChecked, Input, Output, Renderer, EventEmitter
} from '@angular/core';
import { By } from '../models/sort-by';

@Directive({
  selector: '[libSorter]'
})
export class TableSorterDirective implements AfterViewChecked {
  @Input()
  libSorter: By;
  @Output()
  sorted = new EventEmitter();

  constructor(private el: ElementRef) {
  }

  ngAfterViewChecked() {
    const element: HTMLElement = this.el.nativeElement;
    if (this.libSorter) {
      this.addSorter(element);
    }
  }

  addSorter(column: HTMLElement) {
    if (!column.classList.contains('custom_sorter')) {
      column.addEventListener('click', () => this.sendSort(column), false);
      column.classList.add('custom_sorter');
    }
  }

  sendSort(element: HTMLElement) {
    this.hideSorters(element);
    this.libSorter = this.reverseSorter(this.libSorter);
    this.showSorter(element);

    this.sorted.emit(this.libSorter);
  }

  private showSorter(element: HTMLElement) {
    const icon = element.getElementsByTagName('fa-icon')[0];
    icon.classList.remove('hidden');
  }
  private reverseSorter(sorter: By): By {
    sorter = this.libSorter.order === 'asc'
      ? { order: 'desc', property: this.libSorter.property }
      : { order: 'asc', property: this.libSorter.property };

    return sorter;
  }

  private hideSorters(element: HTMLElement) {
    const columns: HTMLElement[] = Array.prototype.slice.call(element.parentElement.getElementsByTagName('th'), 0);
    columns.forEach(column => {
      if (!column.classList.contains(this.libSorter.property)) {
        const icon = column.getElementsByTagName('fa-icon')[0];
        if (icon) {
          icon.classList.add('hidden');
        }
      }
    });
  }
}
