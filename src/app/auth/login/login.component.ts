import * as ui from './../../shared/ui.actions';
import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  login: FormGroup;
  loading: boolean = false;
  uiSub: Subscription;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.login = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    })

    this.uiSub = this.store.select("ui").subscribe(ui => {
      this.loading = ui.isLoading
    })
  }

  ngOnDestroy() {
    this.uiSub.unsubscribe()
  }

  loginUsuario() {

    if (this.login.invalid) return;

    this.store.dispatch(ui.isLoading())

    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })

    const { email, password } = this.login.value
    this.auth.loginUsuario(email, password)
      .then(
        params => {
          // Swal.close()
          this.store.dispatch(ui.stopLoading())

          this.router.navigate(["/"])
        }
      )
      .catch(
        error => {
          this.store.dispatch(ui.stopLoading())
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
            footer: '<a href>Why do I have this issue?</a>'
          })
        }
      )
  }

}
