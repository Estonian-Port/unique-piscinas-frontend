import { Component } from '@angular/core';
import { Clima } from 'src/app/model/Clima';
import { Entradas } from 'src/app/model/Entradas';
import { Equipamiento } from 'src/app/model/Equipamiento';
import { Luces } from 'src/app/model/Luces';
import { Pileta } from 'src/app/model/Pileta';
import { Sistema } from 'src/app/model/Sistema';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {


pileta = new Pileta(48, 7.2, 0.1, 24.5, -0.3)
pileta2 = new Pileta(48, 7.2, 0.1, 24.5, -0.3)
pileta3 = new Pileta(48, 7.2, 0.1, 24.5, -0.3)

listaLecturaPileta = [this.pileta, this.pileta2, this.pileta3]

clima = new Clima(28, "Soleado", "Madrid, España", 45, 12)

sistema = new Sistema("En reposo", 0, 1.2, "optimo", 2, 4)

entradas = new Entradas(true, false, true)

equipamiento = new Equipamiento("Inactiva", 23, 65, 72, "Óptimo", 68)

luces = new Luces("Manual", "Apagado")

toggleEntrada(arg0: string) {
  throw new Error('Method not implemented.');
  }

}
