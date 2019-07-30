import { Component, Input, forwardRef, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
const noop = () => { };

@Component({
    selector: 'aq-inline-input',
    templateUrl: 'aq-inline-input.component.html',
    styleUrls: ['aq-inline-input.component.scss', '../styles.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AQInlineInputComponent),
            multi: true
        }
    ]
})

export class AQInlineInputComponent implements ControlValueAccessor {
    @Input() placeholder = 'Set value';
    @Input() max: number;
    @Input() min: number;
    @Output() errorText = new EventEmitter();
    @ViewChild('input', { static: false }) inputElement: ElementRef;
    private oldValue = '';
    private disabled = false;
    private innerValue = '';
    private isInEditMode = false;
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    get value(): any {
        return this.innerValue;
    }

    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
        }
    }

    get valueToShow(): string {
        return this.value ? this.value : this.placeholder;
    }

    onClick() {
        if (!this.disabled) {
            this.oldValue = `${this.innerValue}`;
            this.isInEditMode = true;
            setTimeout(() => {
                this.inputElement.nativeElement.focus();
            }, 0);
        }
    }

    apply() {
        if (this.isValueValid()) {
            this.isInEditMode = false;
            if (this.oldValue !== this.innerValue) {
                this.innerValue = this.innerValue.trim();
                this.onChangeCallback(this.innerValue);
            }
        } else {
            this.errorText.emit(`Value length should be ${this.min
                ? `more than ${this.min}`
                : ''}${this.min && this.max
                    ? ' and '
                    : ''}${this.max
                        ? `less than ${this.max}`
                        : ''} characters.`);
        }
    }

    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    isValueValid(): boolean {
        let valid = true;
        if (this.min || this.max) {
            if (this.min) {
                valid = this.innerValue.length >= this.min;
            }

            if (this.max) {
                console.log(this.innerValue.length <= this.max);
                valid = this.innerValue.length <= this.max && valid;
            }
        }

        return valid;
    }
}
