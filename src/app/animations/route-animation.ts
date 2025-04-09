import { animate, style, transition, trigger } from '@angular/animations';

export const routeAnimation = trigger('routeAnimation', [
  transition('* <=> *', [
    style({ opacity: 0 }),
    animate('0.2s 0.1s ease-in-out', style({ opacity: 1}))
  ]),
  transition(':leave', [
    animate('0.1s ease', style({ opacity: 0, visibility: 'hidden' }))
  ])
]);