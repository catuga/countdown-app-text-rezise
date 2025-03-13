import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-countdown',
  imports: [FormsModule],
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {
  eventTitle: string = 'Midsummer Eve';
  eventDate: string = '2025-06-21';
  remainingTime: string = '';
  private subscription: Subscription | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const storedTitle = localStorage.getItem('eventTitle');
    const storedDate = localStorage.getItem('eventDate');

    if (storedTitle && storedDate) {
      this.eventTitle = storedTitle;
      const formattedDate = new Date(storedDate).toISOString().slice(0, 10);
      this.eventDate = formattedDate;
    }

    this.cdr.detectChanges();

    this.updateCountdown();
    this.subscription = interval(1000).subscribe(() => this.updateCountdown());
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.saveLocalStorage();
  }

  saveLocalStorage() {
    localStorage.setItem('eventTitle', this.eventTitle);
    localStorage.setItem('eventDate', this.eventDate);
  }

  private updateCountdown() {
    const currentTime = new Date();

    const targetTime = new Date(this.eventDate);
    const timeDifference = targetTime.getTime() - currentTime.getTime();

    if (timeDifference <= 0) {
      this.remainingTime = 'Event Started';
    } else {
      const days = Math.floor(timeDifference / (1000 * 3600 * 24));
      const hours = Math.floor((timeDifference % (1000 * 3600 * 24)) / (1000 * 3600));
      const minutes = Math.floor((timeDifference % (1000 * 3600)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      this.remainingTime = `${days} days, ${hours} h, ${minutes} m, ${seconds} s`;
    }
  }
}
