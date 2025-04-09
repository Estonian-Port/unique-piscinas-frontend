import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { routeAnimation } from './animations/route-animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routeAnimation]
})
export class AppComponent {
  title = 'unique-piscinas-frontend';

  constructor(protected route: ActivatedRoute) {}
}
