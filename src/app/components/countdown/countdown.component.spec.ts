import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CountdownComponent } from './countdown.component';

describe('CountdownComponent', () => {
  let component: CountdownComponent;
  let fixture: ComponentFixture<CountdownComponent>;

  beforeEach(() => {
    localStorage.clear();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountdownComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load localStorage values on init', () => {
    localStorage.setItem('eventTitle', 'Test Event');
    localStorage.setItem('eventDate', '2025-12-31');

    fixture = TestBed.createComponent(CountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.eventTitle).toBe('Test Event');
    expect(component.eventDate).toBe('2025-12-31');
  });

  it('should update remainingTime to show countdown for a future event', () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const formattedTomorrow = tomorrow.toISOString().slice(0, 10);
    component.eventDate = formattedTomorrow;

    component['updateCountdown']();

    expect(component.remainingTime).not.toBe('Event Started');
    expect(component.remainingTime).toContain('days');
  });

  it('should update remainingTime to "Event Started" for a past event', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const formattedYesterday = yesterday.toISOString().slice(0, 10);
    component.eventDate = formattedYesterday;

    component['updateCountdown']();

    expect(component.remainingTime).toBe('Event Started');
  });

  it('should save to localStorage when calling saveLocalStorage', () => {
    component.eventTitle = 'Local Storage Test';
    component.eventDate = '2025-12-25';

    component.saveLocalStorage();

    expect(localStorage.getItem('eventTitle')).toBe('Local Storage Test');
    expect(localStorage.getItem('eventDate')).toBe('2025-12-25');
  });

  it('should update countdown relative to the current time', fakeAsync(() => {
    const now = new Date();
    const offset = (1 * 24 * 60 * 60 * 1000) + (1 * 60 * 60 * 1000) + (1 * 60 * 1000) + (1 * 1000);
    const futureDate = new Date(now.getTime() + offset);
    const formattedDate = futureDate.toISOString().slice(0, 10);
    component.eventDate = formattedDate;

    component['updateCountdown']();
    const initialCountdown = component.remainingTime;
    tick(1000);
    component['updateCountdown']();
    const updatedCountdown = component.remainingTime;

    expect(updatedCountdown).not.toEqual(initialCountdown);
  }));
});
