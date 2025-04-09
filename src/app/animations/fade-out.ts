import { animate, style, transition, trigger } from '@angular/animations';

export const fadeOut = trigger('fadeOut', [
  transition(':leave', [
    animate('0.2s ease', style({ opacity: 0, visibility: 'hidden' }))
  ])
])