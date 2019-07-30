import {
    Directive, ElementRef, AfterViewChecked, Input, HostListener
} from '@angular/core';

@Directive({
    selector: '[libColWidthDirective]'
})
export class MatchWidthDirective implements AfterViewChecked {
    @Input()
    colWidthDirective: string;

    constructor(private el: ElementRef) {
    }

    ngAfterViewChecked() {
        this.matchWidth(this.el.nativeElement);
    }

    matchWidth(parent: HTMLElement) {
        if (!parent) { return; }
        const header = parent.getElementsByClassName('headers').item(0);
        const hiddenHeader = parent.getElementsByClassName('hidden-header').item(0);
        if (!header || !hiddenHeader) { return; }
        const headers = header.getElementsByTagName('th');
        const hiddenHeaders = hiddenHeader.getElementsByTagName('th');

        for (let i = 0; i < hiddenHeaders.length; i++) {
            hiddenHeaders[i].style.width = 'initial';
            headers[i].style.width = 'initial';
        }

        for (let i = 0; i < hiddenHeaders.length; i++) {
            const curHiddenHeader = hiddenHeaders.item(i);
            const curHeader = headers.item(i);
            if (!curHiddenHeader || !curHeader) { return; }
            const width = Math.floor(
                curHiddenHeader.getBoundingClientRect().width >= curHeader.getBoundingClientRect().width
                    ? curHiddenHeader.getBoundingClientRect().width
                    : curHeader.getBoundingClientRect().width);
            curHeader.style.width = `${width}px`;
            curHiddenHeader.style.width = `${width}px`;
        }
    }

    @HostListener('window:resize')
    onResize() {
        this.matchWidth(this.el.nativeElement);
    }

    @HostListener('click')
    onClick() {
        this.matchWidth(this.el.nativeElement);
    }
}
