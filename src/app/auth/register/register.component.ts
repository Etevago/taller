import { takeUntil } from 'rxjs/operators';
import * as ui from './../../shared/ui.actions';
import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  registro: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.registro = this.fb.group({
      nombre: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    })

    this.store.select("ui")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(ui =>
        this.loading = ui.isLoading)
  }




  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()
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
