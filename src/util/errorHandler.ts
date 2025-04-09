export class ErrorMensaje {
  constructor(public condicional : boolean, public mensaje : String){

  }
}

export function mostrarErrorConMensaje(component: any, error: any): void {
  var errorMessage : string
  if(error.status === 0) {
    errorMessage = 'Error al conectar con el servidor. Sistema en mantenimiento.'
  }else if(error.status === 403){
    errorMessage = 'Usuario o contraseña incorrecta.'
  }else{
    errorMessage = error.error
  }
  component.errors.push(errorMessage)
}