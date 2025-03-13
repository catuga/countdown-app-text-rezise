import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CountdownComponent } from './countdown/countdown.component';

@Component({
  selector: 'app-root',
  imports: [CountdownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
