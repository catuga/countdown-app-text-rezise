import { Directive, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appFitText]'
})
export class FitTextDirective implements AfterViewInit, OnDestroy {
  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => this.adjustFontSize());
    this.resizeObserver.observe(this.el.nativeElement);

    this.mutationObserver = new MutationObserver(() => this.adjustFontSize());
    this.mutationObserver.observe(this.el.nativeElement, {
      childList: true,
      characterData: true,
      subtree: true
    });

    this.adjustFontSize();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
  }

  private adjustFontSize(): void {
    const element = this.el.nativeElement as HTMLElement;
    element.style.whiteSpace = 'nowrap';
    element.style.display = 'inline-block';

    const parentWidth = element.parentElement?.clientWidth || window.innerWidth;

    let fontSize = 300;
    element.style.fontSize = fontSize + 'px';

    while (element.scrollWidth > parentWidth && fontSize > 0) {
      fontSize--;
      element.style.fontSize = fontSize + 'px';
    }
  }
}
