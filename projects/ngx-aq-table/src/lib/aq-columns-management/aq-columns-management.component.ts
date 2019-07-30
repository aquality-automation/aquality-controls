import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AQColumn } from '../models/aq-table-column';

@Component({
  selector: 'aq-columns-management',
  templateUrl: './aq-columns-management.component.html',
  styleUrls: ['./aq-columns-management.component.scss', '../styles.scss']
})
export class AQColumnsManagementComponent implements OnInit {

  constructor() { }

  @Input() columnsToShow: AQColumn[];
  @Input() columnsToHide: AQColumn[];

  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
