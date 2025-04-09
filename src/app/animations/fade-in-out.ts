import { animate, style, transition, trigger } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
 transition(':enter', [
  style({ opacity: 0, visibility: 'hidden'}), 
  animate('0.3s 0.2s ease', style({ opacity: 1 , visibility: 'visible'}))
]),
  transition(':leave', [
    animate('0.2s ease', style({ opacity: 0, visibility: 'hidden' }))
  ])
])