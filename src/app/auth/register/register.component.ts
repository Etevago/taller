import * as ui from './../../shared/ui.actions';
import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registro: FormGroup;
  loading: boolean = false;
  uiSub: Subscription;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.registro = this.fb.group({
      nombre: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    })

    this.uiSub = this.store.select("ui").subscribe(ui =>
      this.loading = ui.isLoading)
  }




  ngOnDestroy() {
    this.uiSub?.unsubscribe()
  }

  crearUsuario() {
    if (this.registro.invalid) {
      return
    }
    this.store.dispatch(ui.isLoading())
    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })

    const { nombre, email, password } = this.registro.value
    this.auth.crearUsuario(nombre, email, password)
      .then(params => {
        // Swal.close()
        this.store.dispatch(ui.stopLoading())
        this.router.navigate(["/"])
      })
      .catch(error => {
        this.store.dispatch(ui.stopLoading())
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        })
      })
  }

}
