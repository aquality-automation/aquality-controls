import {
    Directive, ElementRef, AfterViewChecked, Input, HostListener
} from '@angular/core';

@Directive({
    selector: '[libDataHeightDirective]'
})
export class DataHeightDirective implements AfterViewChecked {
    @Input()
    libDataHeightDirective: string;

    constructor(private el: ElementRef) {
    }

    ngAfterViewChecked() {
        this.setHeight(this.el.nativeElement);
    }

    setHeight(parent: HTMLElement) {
        if (!parent) { return; }

        const headerTable = parent.getElementsByTagName('table').item(0) as HTMLElement;
        const dataWrapper = parent.getElementsByClassName('data-holder').item(0) as HTMLElement;
        const globalWrapper = parent.parentElement.parentElement as HTMLElement;

        if (!globalWrapper || !headerTable) { return; }
        dataWrapper.style.height =
            `${globalWrapper.getBoundingClientRect().height - headerTable.getBoundingClientRect().height}px`;
    }

    @HostListener('window:resize')
    onResize() {
        this.setHeight(this.el.nativeElement);
    }
}
