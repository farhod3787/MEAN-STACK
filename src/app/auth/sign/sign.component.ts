import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
 
import { AuthService} from '../auth.service'; 
@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  constructor( private authService: AuthService) { }

  ngOnInit() {
  }


  onSign(form: NgForm) { 
    if (form.invalid) {
      return ;
    }
    this.authService.createUser(form.value.email, form.value.password);
  }

}
