import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FitTextDirective } from './fit-text-directive.directive';

@Component({
  template: `
    <div class="parent" style="width: 200px;">
      <h1 appFitText>Test Fit Text</h1>
    </div>
  `,
  imports: [FitTextDirective]
})
class TestComponent {}

describe('FitTextDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let debugEl: DebugElement;
  let h1: HTMLElement;
  let parentEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent]
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.directive(FitTextDirective));
    h1 = debugEl.nativeElement as HTMLElement;
    parentEl = h1.parentElement as HTMLElement;

    Object.defineProperty(parentEl, 'clientWidth', { value: 200, configurable: true });

    Object.defineProperty(h1, 'scrollWidth', {
      get: function() {
        const fontSize = parseInt(this.style.fontSize, 10);
        return fontSize > 150 ? 210 : 190;
      },
      configurable: true
    });
  });

  it('should create an instance', () => {
    expect(h1).toBeTruthy();
  });

  it('should adjust font size so that scrollWidth is less than or equal to parent width', () => {
    const directiveInstance = debugEl.injector.get(FitTextDirective);
    directiveInstance['adjustFontSize']();
    fixture.detectChanges();

    const computedFontSize = parseInt(h1.style.fontSize, 10);
    expect(computedFontSize).toBeLessThanOrEqual(150);
    expect(h1.scrollWidth).toBeLessThanOrEqual(parentEl.clientWidth);
  });

  it('should update font size when text changes (via MutationObserver simulation)', () => {
    const directiveInstance = debugEl.injector.get(FitTextDirective);
    directiveInstance['adjustFontSize']();
    const initialFontSize = parseInt(h1.style.fontSize, 10);
    expect(initialFontSize).toBe(150);
  

    h1.textContent = 'This is a much longer text that should force a reduction in font size';

    Object.defineProperty(h1, 'scrollWidth', {
      get: function () {
        const fontSize = parseInt(this.style.fontSize, 10);

        return this.textContent && this.textContent.length > 15
          ? (fontSize > 140 ? 210 : 190)
          : (fontSize > 150 ? 210 : 190);
      },
      configurable: true
    });

    h1.style.fontSize = '300px';
    directiveInstance['adjustFontSize']();
    fixture.detectChanges();
  
    const updatedFontSize = parseInt(h1.style.fontSize, 10);
    expect(updatedFontSize).toBeLessThan(initialFontSize);
  });  

  it('should update font size on parent resize', fakeAsync(() => {
    const directiveInstance = debugEl.injector.get(FitTextDirective);
    directiveInstance['adjustFontSize']();
    const initialFontSize = parseInt(h1.style.fontSize, 10);

    Object.defineProperty(parentEl, 'clientWidth', { value: 100, configurable: true });
    directiveInstance['adjustFontSize']();
    fixture.detectChanges();

    const updatedFontSize = parseInt(h1.style.fontSize, 10);
    expect(updatedFontSize).toBeLessThan(initialFontSize);
  }));
});
