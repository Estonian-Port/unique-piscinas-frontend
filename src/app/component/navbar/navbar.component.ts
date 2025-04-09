import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private router: Router, private location: Location) { }

  dropdownVisible : boolean = false;

  @ViewChild('dropdownMenu') 
  dropdownMenu!: ElementRef;

  isLogin() {
    return "/login" == this.location.path()
  }

  logout() {
    //this.loginService.logout()
    this.dropdownVisible = false
    this.router.navigateByUrl('/login')
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (this.dropdownVisible &&
      !this.dropdownMenu.nativeElement.contains(event.target)) {
      this.dropdownVisible = false
    }
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.dropdownVisible = !this.dropdownVisible
  }


  perfil() {
  throw new Error('Method not implemented.');
  }
  clientes() {
  throw new Error('Method not implemented.');
  }

}
