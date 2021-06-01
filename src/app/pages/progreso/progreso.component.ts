import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CalendarService } from './../../services/calendar.service';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '../../app.reducer';
import { DashboardService } from '../../dashboard/dashboard.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { contador, setVisibles, setContador, stopReparar, stopContador } from './progreso.actions';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-estadistica',
  templateUrl: './progreso.component.html',
  styles: [

  ]
})
export class ProgresoComponent implements OnInit, OnDestroy {

  private unsubscribe: Subject<void> = new Subject();
  reparando = false;
  egresos: number = 0;
  totalEgresos: number = 0;
  total: number;
  contador: number = 0;
  parar: boolean;
  cita: boolean;
  cargando = true
  id: string;
  titulo: string;
  dia: string;
  reparaciones = []
  visibles = [];
  proxima = "2099-01-01"
  constructor(private store: Store<AppState>, private ds: DashboardService, private calS: CalendarService, private router: Router) {
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

      this.store.select("contador")
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((cont) => {
          if (cont.visibles.length > 0) {
            this.visibles = cont.visibles
          }
          this.reparando = cont.reparando
          this.id = cont.id
          this.cita = cont.cita
          this.contador = Number(cont.cont.toFixed())
          this.reparaciones = cont.reparacion
          const x = this.contador * this.reparaciones.length / 100;
          const rep = this.reparaciones[(x) - 1];
          const repDec = this.reparaciones[Number((this.contador * this.reparaciones.length / 100).toFixed()) - 1]

          if (this.contador >= 100) {
            this.visibles = this.reparaciones
            this.calS.finalizarFecha(cont.id)
            Swal.fire({
              icon: 'success',
              title: 'Completada',
              text: '¡La reparación ha sido completada con éxito!',
            })
            this.store.dispatch(stopReparar())
            this.store.dispatch(stopContador())
            this.ds.reparacionReiniciar()
            this.ds.stopReparacion()
            this.store.dispatch(setContador({ actual: 0 }))
            this.store.dispatch(setVisibles({ visibles: [] }))
            setTimeout(() => {
              this.router.navigate(["pago"])
              this.store.dispatch(setContador({ actual: 0 }))
            }, 1000);
          }

          if ((repDec != undefined) && (!this.visibles.find(param => param == repDec)) &&
            ((x > (Number(x.toFixed()) - (this.reparaciones.length / 100))))) {
            this.visibles = Object.assign([], this.visibles)
            this.visibles.push(repDec);
            // this.calS.updateVisibles(this.id, repDec)
            this.store.dispatch(setVisibles({ visibles: this.visibles }))
          } else if ((rep != undefined) && (!this.visibles.find(param => param == rep)) &&
            ((x > (Number(x.toFixed()) - (this.reparaciones.length / 100))))) {
            this.visibles = Object.assign([], this.visibles)
            this.visibles.push(rep);
            // this.calS.updateVisibles(this.id, rep)
            this.store.dispatch(setVisibles({ visibles: this.visibles }))
          }
          // console.log(this.visibles);
        });
      let indiceProximo = "0"
      this.store.select("items")
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(({ calendar }: any) => {
          if (calendar.length > 1) {
            for (const key in calendar) {
              if (Object.prototype.hasOwnProperty.call(calendar, key)) {
                const element: any = calendar[key];
                if ((element.data.start < this.proxima) && !element.data.finalizada) {
                  this.proxima = element.data.start
                  indiceProximo = key
                }
              }
            }
          }
          if (calendar.length > 0) {
            this.titulo = calendar[Number(indiceProximo)].data.title
            this.dia = calendar[Number(indiceProximo)].data.start
          }
        })
      Swal.close()
      this.cargando = false
    }, 1000);

  }

  reparar() {
    this.ds.crearReparacion()
    this.store.select("contador").subscribe(params => {
      this.parar = params.parar
    })

    const intervalo = setInterval(() => {

      if (this.contador >= 100) {
        this.ds.reparacionCompleta()
        // this.ds.stopReparacion();
        clearInterval(intervalo);
        return 2;
      }
      else if (this.parar) {
        // this.ds.stopReparacion();
        clearInterval(intervalo);
      }

      this.store.dispatch(contador())
    }, 1000)


  }

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }


}
