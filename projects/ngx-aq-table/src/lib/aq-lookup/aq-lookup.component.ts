import { Component, OnChanges, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SorterService } from '../helpers/sorter.service';
import { faCaretDown, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'aq-lookup',
    templateUrl: 'aq-lookup.component.html',
    styleUrls: ['aq-lookup.component.scss', '../styles.scss']
})
export class AQLookupComponent implements OnInit, OnChanges {
    constructor(
        private sortService: SorterService,
        public datepipe: DatePipe
    ) { }

    hidden = true;
    filteredArray: any[];
    fa = { faCaretDown, faTimes };

    @Input() type = 'lookup';
    @Input() inline = false;
    @Input() enableSort = true;
    @Input() small: boolean;
    @Input() cutLongText = false;
    @Input() placeholder = 'Not Selected';
    @Input() required = false;
    @Input() emptyForFilter: boolean;
    @Input() propertiesToShow: string[];
    @Input() array: any[];
    @Input() model: any;
    @Input() disabled: boolean;
    @Input() sortBy: { property: string, order: string };
    @Input() allowCreation = false;
    @Output() modelChange = new EventEmitter();
    @Output() searchText = new EventEmitter();
    selectedItems: any[] = [];
    selectedItemText: string;
    notSelectedItems: any[] = [];
    emptyValue = undefined;
    emptyValueForFilter = { findEmpty: true };

    ngOnInit(): void {
        if (this.type === 'multiselect' && !this.model) {
            this.model = [];
        }
        this.getTextToShow();
    }

    ngOnChanges() {
        if (this.array) {
            this.notSelectedItems = this.array.slice();
            this.notSelectedItems = this.adjustArrayToModel();
            this.filteredArray = this.notSelectedItems.slice();
            this.sort();
        }
        this.getTextToShow();
    }

    getTextToShow() {
        if (!Array.isArray(this.model)) {
            this.selectedItemText = this.model
                ? this.textToShow(this.model)
                : undefined;
        } else {
            this.selectedItemText = '';
            const itemTexts = [];
            this.model.forEach(item => {
                itemTexts.push(this.textToShow(item));
            });
            this.selectedItemText = itemTexts.join(', ');
        }
    }

    toggle() {
        this.hidden
            ? this.toggleOn()
            : this.toggleOff();
    }

    toggleOn() {
        if (this.hidden) {
            this.hidden = false;
        }
    }

    toggleOff() {
        this.hidden = true;
        const text = !Array.isArray(this.model)
            ? this.textToShow(this.model)
            : undefined;
        this.selectedItemText = text;
        this.filter(undefined);
    }

    select(item: string) {
        if (Array.isArray(this.model)) {
            this.model.push(item);
            this.notSelectedItems = this.adjustArrayToModel();
            this.filter(this.selectedItemText);
        } else {
            this.model = item;
            this.notSelectedItems = this.adjustArrayToModel();
            this.selectedItemText = this.textToShow(item);
            this.filter(undefined);
            this.toggleOff();
        }

        this.itemUpdate(this.model);
    }

    adjustArrayToModel() {
        let newArray = this.array.slice();
        if (newArray) {
            if (Array.isArray(this.model)) {
                this.model.forEach(item => {
                    newArray = newArray.filter(x => {
                        return JSON.stringify(x) !== JSON.stringify(item);
                    });
                });
            } else {
                newArray = newArray.filter(x => JSON.stringify(x) !== JSON.stringify(this.model));
            }
        }
        return newArray;
    }

    removeFromSelected(item: any) {
        this.model = this.model.filter(x => x !== item);
        this.notSelectedItems.push(item);
        this.filter(this.selectedItemText);
        this.itemUpdate(this.model);
    }

    itemUpdate($event: {}) {
        this.modelChange.emit($event);
    }

    sendSearchText() {
        this.searchText.emit(this.selectedItemText);
    }

    inList(): boolean {
        return this.selectedItemText ? this.array.find(x => x.name === this.selectedItemText.trim()) : true;
    }

    filter($event: string) {
        if ($event && $event !== '') {
            this.filteredArray = this.notSelectedItems.filter(x => this.textToShow(x).toLowerCase().includes($event.toLowerCase().trim()));
        } else {
            this.filteredArray = this.notSelectedItems;
        }
        this.sort();
    }

    textToShow(item: string): string {
        if (item) {
            let textToShow = '';
            if (this.propertiesToShow) {
                this.propertiesToShow.forEach(property => {
                    const props = property.split('.');
                    let itemValue = item;
                    props.forEach(prop => {
                        if (!itemValue) {
                            return '';
                        }
                        itemValue = itemValue[prop];
                    });
                    if (typeof itemValue === 'number') {
                        itemValue = this.datepipe.transform(new Date(itemValue), 'yyyy-MM-dd hh:mm:ss a');
                    }
                    textToShow = `${textToShow} ${itemValue}`;
                });
            } else {
                textToShow = item;
            }
            return textToShow.trim();
        }
        return '';
    }

    sort() {
        if (this.enableSort) {
            if (this.filteredArray && !this.sortBy) {
                this.filteredArray.sort((a, b) => {
                    if (this.textToShow(a).toLowerCase() > this.textToShow(b).toLowerCase()) {
                        return 1;
                    }
                    if (this.textToShow(a).toLowerCase() < this.textToShow(b).toLowerCase()) {
                        return -1;
                    }
                    return 0;
                });
            } else if (this.filteredArray && !this.sortBy) {
                this.sortService.sort(this.filteredArray, this.sortBy);
            }
        }
    }
}
