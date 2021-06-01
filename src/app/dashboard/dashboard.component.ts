import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CalendarService } from './../services/calendar.service';
import { CitaService } from './../services/cita.service';
import { setCalendar } from './items.actions';
import { setContador, reparar, contador, startContador, setUser, setReparaciones, startCita, setID, setVisibles, setTitulo, setDia, stopReparar, stopContador } from './../pages/progreso/progreso.actions';
import { DashboardService } from './dashboard.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AppState } from '../app.reducer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  segundosActuales: number;
  segundosFB: number;
  contador: number;
  reparando: boolean;
  parar: boolean;
  calendarSubs: Subscription;
  reparaciones = [];
  visibles = [];
  proxima = "2099-01-01"
  repID: string
  titulo: string
  dia: string
  pasar = []
  pasarVis = []
  constructor(private store: Store<AppState>, private ds: DashboardService, private calendarS: CalendarService, private router: Router) { }

  ngOnInit(): void {
    this.store.select("user")
      .pipe(
        takeUntil(this.unsubscribe),
        filter(auth => auth.user != null)
      )
      .subscribe(
        ({ user }) => {
          this.calendarS.initCalendarListener(user.uid)
            .subscribe((calendar: any) => {
              this.store.dispatch(setCalendar({ items: calendar }))
              this.store.dispatch(setUser({ user: user.uid }))
            })

          this.segundosFB = user?.tiempo
          this.contador = user?.contador
          this.reparando = user?.reparando
          if (user.contador >= 100) {
            this.store.dispatch(setContador({ actual: 100 }))
          }
        })

    let indiceProximo;
    this.store.select("items")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ calendar }: any) => {
        this.proxima = "2099-01-01";
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
          if (indiceProximo) {
            this.store.dispatch(startCita())
            const proximo = Number(indiceProximo)
            this.reparaciones = calendar[proximo].data.reparaciones
            // this.visibles = calendar[proximo].data.visibles
            this.repID = calendar[proximo].uid
            this.dia = calendar[proximo].data.start
            this.titulo = calendar[proximo].data.title
            this.pasar = [];
            this.pasarVis = [];

            Object.keys(this.reparaciones).forEach(key => {
              const data = {}
              data[key] = this.reparaciones[key]
              this.pasar.push(data)
            })

            // ARREGLAR 
            // ESTO
            // JODER
            // this.visibles.forEach(element => {
            //   console.log("element " + element);
            //   Object.keys(element).forEach(element2 => {
            //     console.log("element2 " + element2);
            //     Object.keys(element2).forEach(key => {
            //       const data = {}
            //       if (this.visibles.length == 0) {
            //         data[key] = this.visibles[element2][key]
            //         console.log("key " + key);
            //         console.log("entero " + this.visibles[element2][key]);
            //         this.pasarVis.push(data)
            //       } else {
            //         data[this.visibles.length - 1] = this.visibles[element2][this.visibles.length - 1]
            //         console.log("this.visibles.length-1 " + (this.visibles.length - 1));
            //         console.log("entero " + this.visibles[element2][this.visibles.length - 1]);
            //         this.pasarVis.push(data)
            //       }

            //     })
            //   })
            // })
            if (this.pasar.length > 0) {
              this.store.dispatch(setReparaciones({ reparacion: this.pasar }))
            }
          }
        } else {
          this.store.dispatch(setReparaciones({ reparacion: [] }))
          this.store.dispatch(setVisibles({ visibles: [] }))
        }
      })

    setTimeout(() => {
      this.store.dispatch(startContador())
      this.store.dispatch(setID({ id: this.repID }))


      // if (this.pasarVis.length > 0) {
      //   this.store.dispatch(setVisibles({ visibles: this.pasarVis }))
      //   console.log(this.pasarVis);
      //   // console.log("veces");
      // }
      if (this.reparando) {
        this.segundosActuales = new Date().getTime()
        const diferencia = (this.segundosActuales - this.segundosFB) / 1000
        this.contador += diferencia
        this.store.dispatch(reparar())
        this.store.dispatch(setContador({ actual: this.contador }))
      }
      this.store.select("contador")
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((cont) => {
          if (cont.visibles.length > 0) {
            this.visibles = cont.visibles
          }
          this.parar = cont.parar
          // this.reparando = cont.reparando
          this.contador = Number(cont.cont.toFixed())
          this.reparaciones = cont.reparacion
          const x = this.contador * this.reparaciones.length / 100;
          const rep = this.reparaciones[(x) - 1];
          const repDec = this.reparaciones[Number((this.contador * this.reparaciones.length / 100).toFixed()) - 1]

          if (this.contador >= 100) {
            this.visibles = this.reparaciones
            this.calendarS.finalizarFecha(cont.id)
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
            }, 1100);
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

      if (this.reparando) {
        this.store.select("contador")
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((res) => {
            this.contador = res.cont
          });
        const intervalo = setInterval(() => {

          if (this.contador >= 100) {
            this.ds.reparacionCompleta()
            this.ds.stopReparacion();
            clearInterval(intervalo);
          }
          else if (this.parar) {
            // this.ds.stopReparacion();
            clearInterval(intervalo);
          }

          this.store.dispatch(contador())
        }, 1000)
      } else {
        this.store.dispatch(setContador({ actual: 0 }))
      }

    }, 1000);

  }

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }


}
