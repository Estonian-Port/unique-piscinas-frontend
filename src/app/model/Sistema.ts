export class Sistema {
  constructor(public filtro: string, public entradasActivas: number, public presionTrabajo : number,
    public presionEstado : string, public ultimaActividad : number, public proximoCiclo : number) {}
}
