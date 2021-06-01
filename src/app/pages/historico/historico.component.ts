import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit, OnDestroy {

  finalizadas = []
  total = []
  cargando = true;
  private unsubscribe: Subject<void> = new Subject();

  
  basicData: any;
    
  basicOptions: any;

  multiAxisData: any;

  chartOptions: any;

  multiAxisOptions: any;

  stackedData: any;

  stackedOptions: any;
  
  subscription: Subscription;

  // config: AppConfig;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      },
      allowOutsideClick: false

    })
    setTimeout(() => {
      this.store.select("items")
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(({ calendar }: any) => {
          calendar.forEach(cita => {
            if (cita.data.finalizada && !this.finalizadas.find(param => param == cita.data.finalizada)) {
              this.finalizadas.push(cita)
              let precio = 0
              cita.data.reparaciones.forEach(rep => {
                precio += rep.price
              })
              this.total.push(precio)
            }
          });
        })
      Swal.close()
      this.cargando = false
    }, 1000);

  }

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }
}
