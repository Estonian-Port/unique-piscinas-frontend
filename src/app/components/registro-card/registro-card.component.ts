import { Component, Input } from '@angular/core';

export class Registro {
constructor(
    public accion: string,
    public fecha: string,
    public dispositivo: string,
    public descripcion: string,
    public tecnico: string
  ) {}
}

@Component({
  selector: 'app-registro-card',
  templateUrl: './registro-card.component.html',
})
export class RegistroCardComponent{

  @Input() 
  registro = new Registro("Mantenimiento Preventivo", "2023-07-15", "Bomba principal", "Se realizo una limpieza de los filtros...", "Carlos Rodriguez" )

}
