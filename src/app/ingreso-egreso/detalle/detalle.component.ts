import { CalendarService } from './../../services/calendar.service';
import { AppStateIngreso } from './../ingreso-egreso.reducer';
import { IngresoEgresoService } from './../../services/ingreso-egreso.service';
import { pipe, Subscription } from 'rxjs';
import { IngresoEgreso } from './../../models/ingreso-egreso.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {
  eventGuid = 0;

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubs: Subscription;
  nombre: string;
  uid: string;
  coleccion;
  constructor(private store: Store<AppStateIngreso>, private ies: IngresoEgresoService, private calendarS: CalendarService) { }

  ngOnInit(): void {
    this.ingresosSubs = this.store.select("ingresosEgresos").subscribe(({ items }) => {
      this.ingresosEgresos = items
    })
    this.store.select("user")
      .subscribe(({ user }) => {
        this.nombre = user?.nombre
        this.uid = user?.uid
      });

    this.coleccion = this.calendarS.initCalendarListener(this.uid);
    console.log(this.coleccion);
  }

  ngOnDestroy() {
    this.ingresosSubs.unsubscribe()
  }

  borrar(uid: string) {
    this.ies.borrarIngresoEgreso(uid)
      .then(() => Swal.fire("Borrado", "Item borrado", "success")
      )
      .catch(error => {
        Swal.fire("Error", "Item no borrado: " + error, "error")
      })
  }




  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    locales: [esLocale],
    initialView: 'dayGridMonth',
    weekends: true,
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
  currentEvents: EventApi[] = [];

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  createEventId() {
    return String(this.eventGuid++);
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
        allDay: selectInfo.allDay
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
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

}
