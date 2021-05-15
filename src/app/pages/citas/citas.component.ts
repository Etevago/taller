import { startCita, stopCita } from './../progreso/progreso.actions';
import Swal from 'sweetalert2';
import { setReparaciones } from '../progreso/progreso.actions';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppState } from '../../app.reducer';
import { filter, takeUntil } from 'rxjs/operators';
import { CalendarService } from '../../services/calendar.service';
import { Subject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import { FormControl } from '@angular/forms';
import { setPago } from '../progreso/progreso.actions';

interface Opcion {
  value: string;
  price: number
}

interface OpcionGroup {
  name: string;
  opcion: Opcion[];
  image: string;

}

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styles: [
    `
    @import url('https://fonts.googleapis.com/css2?family=Acme&family=Days+One&family=Exo:ital,wght@1,300;1,600&family=Play:wght@400;700&display=swap');
    .clearfix {
    float: none;
    clear: both;
}
#head {
    overflow: hidden;
    margin: -20px -200px 22px 300px;
    float: left;
    text-align: center;
}
#select {
    overflow: hidden;
    margin: 50px -290px 0px 300px;
    float: left;
    text-align: center;
}
    `
  ]
})
export class CitasComponent implements OnInit, OnDestroy {

  private unsubscribe: Subject<void> = new Subject();

  pagoTotal = 0;
  suma = 0;
  cita = false;
  nombre: string;
  uid: string;
  coleccion;
  currentEvents: EventApi[] = [];
  iniciales = [];
  selected: any[] = []
  arrayItems = []
  itemId: string
  constructor(private store: Store<AppState>, private calendarS: CalendarService, private firestore: AngularFirestore) { }

  ngOnInit(): void {

    this.selected.forEach(option => {
      this.suma += option.price
    });

    this.store.select("user")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ user }) => {
        this.nombre = user?.nombre
        this.uid = user?.uid
      });

    this.store.select("items")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ items }) => {
        items.forEach(item => {
          this.arrayItems.push(item)
        });
      })

    this.store.select("contador")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.pagoTotal = res.pago
        if (res.reparaciones.length > 0) this.selected = res.reparaciones;
        this.cita = res.cita
      });
  }

  eventos = this.store.select("user")
    .pipe(
      takeUntil(this.unsubscribe),
      filter(auth => auth.user != null)
    )
    .subscribe(
      ({ user }) => this.calendarS.initCalendarListener(user.uid)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((calendarFB: any) => {
          calendarFB.forEach(fecha => {
            this.iniciales.push(fecha.data)
          });
          this.calendarOptions.events = this.iniciales
        })
    )

  confirmar() {
    let suma = 0;
    let sumaFinal = "";
    this.selected.forEach((opcion: Opcion) => {
      suma += opcion.price
    });
    sumaFinal = suma.toFixed(2)
    Swal.fire({
      title: 'Pago total: ' + sumaFinal + "€",
      text: "¿Quiéres confirmar tu cita?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Éxito',
          'Selecciona el día de tu cita',
          'success'
        )
        this.selected.forEach((opcion: Opcion) => {
          this.pagoTotal += opcion.price
        });
        let pagoFinal = 0;
        pagoFinal = Math.round(this.pagoTotal * 1e2) / 1e2

        this.cita = true;
        this.store.dispatch(setPago({ pago: pagoFinal }))
        this.store.dispatch(setReparaciones({ reparaciones: this.selected }))
        this.store.dispatch(startCita())

      }
    })


  }


  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '',
    },
    locales: [esLocale],
    locale: "es",
    initialView: 'dayGridMonth',
    businessHours: true,
    weekends: false,
    slotMinTime: 9,
    slotMaxTime: 20,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };

  atras() {
    this.cita = false;
    this.pagoTotal = 0;
    this.selected = []
    this.store.dispatch(setPago({ pago: 0 }))
    this.store.dispatch(setReparaciones({ reparaciones: [] }))
    this.store.dispatch(stopCita())

  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  getEventId(title: string): string {
    let a: Promise<any>
    let fecha = ""
    setTimeout(() => {
      for (let i = 0; i < this.arrayItems.length; i++) {
        console.log("ARRAY: " + this.arrayItems[i].data.title);
        console.log("ORIGINAL:" + title);
        if (this.arrayItems[i].data.title === title) {
          // CAMBIAR CONDICION
          console.log("dentro");
          a.then(fecha = this.arrayItems[i].uid)
          console.log(this.arrayItems[i].uid);
        }
      }
    }, 100);
    return "3soKIgaY4iKcF2VIZMgo"
  }



  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {

    // modalService.open('custom-modal-1')

    const title = "Reparación " + this.nombre
    this.getEventId(title)
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      this.calendarS.crearFecha({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });

      calendarApi.addEvent({
        id: "EUVA1JVNJMRn3i8SK3tm",
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`¿Seguro que quieres eliminar tu cita? '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
      console.log(clickInfo);
      this.calendarS.borrarFecha(clickInfo.event.id)
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }



  opcionControl = new FormControl();
  opcionGroups: OpcionGroup[] = [
    {
      name: 'Motor',
      image: "assets/images/select/motor.png",
      opcion: [
        { value: '0', price: 80 },
        { value: '1', price: 49.95 },
        { value: '2', price: 54.95 }
      ]
    },
    {
      name: 'Embrague',
      image: "assets/images/select/embrague.png",

      opcion: [
        { value: '3', price: 40 },
        { value: '4', price: 43.95 },
        { value: '5', price: 54.95 }
      ]
    },
    {
      name: 'Filtros',
      image: "assets/images/select/filtros.png",

      opcion: [
        { value: '6', price: 22.95 },
        { value: '7', price: 36.95 },
      ]
    },
    {
      name: 'Lubricantes y líquidos',
      image: "assets/images/select/lubricantes.png",

      opcion: [
        { value: '8', price: 16.95 },
        { value: '9', price: 24 },
        { value: '10', price: 30 },
        { value: '11', price: 35.95 },
      ]
    },
    {
      name: 'Suspensión y dirección',
      image: "assets/images/select/suspension.png",

      opcion: [
        { value: '12', price: 75 },
        { value: '13', price: 75 },
      ]
    },
    {
      name: 'Frenos',
      image: "assets/images/select/frenos.png",

      opcion: [
        { value: '14', price: 64.95 },
        { value: '15', price: 64.95 },
        { value: '16', price: 70 },
        { value: '17', price: 70 },
      ]
    },
  ];

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }
}
