import { AngularFirestore } from '@angular/fire/firestore';
import { AppState } from './../../app.reducer';
import { filter, takeUntil } from 'rxjs/operators';
import { CalendarService } from './../../services/calendar.service';
import { Subject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import { FormControl } from '@angular/forms';
import { setPago } from '../estadistica/estadistica.actions';

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
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  private unsubscribe: Subject<void> = new Subject();

  pagoTotal = 0;
  nombre: string;
  uid: string;
  coleccion;
  currentEvents: EventApi[] = [];
  iniciales = [];
  selected = []



  constructor(private store: Store<AppState>, private calendarS: CalendarService, private firestore: AngularFirestore) { }

  ngOnInit(): void {

    this.store.select("user")
      .subscribe(({ user }) => {
        this.nombre = user?.nombre
        this.uid = user?.uid
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

  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
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

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  createEventId() {
    return String(Math.floor(Math.random() * 999999999));
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = "Reparación " + this.nombre

    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      this.calendarS.crearFecha({
        id: this.createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });

      calendarApi.addEvent({
        id: this.createEventId(),
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
      // console.log(this.calendarS.borrarFecha())
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  confirmar() {
    this.selected.forEach((opcion: Opcion) => {
      this.pagoTotal += opcion.price
    });
    this.store.dispatch(setPago({ pago: this.pagoTotal }))
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
