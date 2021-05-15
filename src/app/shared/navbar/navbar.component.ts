import { takeUntil } from 'rxjs/operators';
import {  Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
    `
    @import url('https://fonts.googleapis.com/css2?family=Acme&family=Days+One&family=Exo:ital,wght@1,300;1,600&family=Play:wght@400;700&display=swap');
    .titulo{
      font-family:"Copperplate"
    }
    `
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  nombre: string;
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {

    this.store.select("user")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ user }) => this.nombre = user?.nombre);
  }

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }

}
