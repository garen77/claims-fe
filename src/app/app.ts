import { Component, signal } from '@angular/core';
<<<<<<< HEAD
import { RouterOutlet,RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink],
=======
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
>>>>>>> 7e5a02d15d027072564431daf0cc8cb3a8f013b8
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('claims-fe');
}
