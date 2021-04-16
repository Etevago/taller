import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  nombre: string;
  userSub: Subscription;
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {

    this.userSub = this.store.select("user")
      .subscribe(({ user }) => this.nombre = user?.nombre);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe()
  }

}
