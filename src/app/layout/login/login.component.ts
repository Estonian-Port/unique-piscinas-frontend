import { Component, EventEmitter, Output } from '@angular/core'
import { Router } from '@angular/router'
import { UsuarioLogin } from 'src/app/model/Usuario'
import { ErrorMensaje } from 'src/util/errorHandler'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  usuarioLogin : UsuarioLogin = new UsuarioLogin('', '')
  errors = []
  errorLogin : ErrorMensaje = new ErrorMensaje(false, '')
  showPassword = false

  @Output () valorLogin = new EventEmitter<boolean>()

  constructor(private router : Router) {}

  onSubmit(form: any) {
    this.ingresar()
  }

  public async ingresar(){

    this.router.navigateByUrl('/')

  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

}



