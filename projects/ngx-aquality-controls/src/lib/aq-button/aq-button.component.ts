import { Component, Input, Output, EventEmitter } from '@angular/core';
import { faEdit, faFilter, faColumns, faSync } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'aq-button',
    templateUrl: 'aq-button.component.html',
    styleUrls: ['aq-button.component.scss', '../styles.scss']
})
export class AQButtonComponent {
    @Input() toggleStatus: boolean;
    @Input() name = '';
    @Input() icon: string;
    @Output() toggled = new EventEmitter();
    @Output() clicked = new EventEmitter();
    fa = { faEdit, faFilter, faColumns, faSync };

    toggle() {
        if (this.toggleStatus !== undefined) {
            this.toggleStatus = !this.toggleStatus;
        }
        this.toggled.emit(this.toggleStatus);
        this.clicked.emit();
    }
}
