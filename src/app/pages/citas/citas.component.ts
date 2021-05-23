import { CitaService } from './../../services/cita.service';
import { Router } from '@angular/router';
import { startCita, stopCita } from './../progreso/progreso.actions';
import Swal from 'sweetalert2';
import { setReparaciones } from '../progreso/progreso.actions';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppState } from '../../app.reducer';
import { filter, takeUntil } from 'rxjs/operators';
import { CalendarService } from '../../services/calendar.service';
import { Subject } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewEncapsulation, ElementRef, ViewChild, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import { FormControl } from '@angular/forms';
import { setPago } from '../progreso/progreso.actions';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { exit } from 'process';

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
  styleUrls: ['./citas.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class CitasComponent implements OnInit, OnDestroy {

  @ViewChild('content') content: ElementRef;
  @Input() public hora;

  private unsubscribe: Subject<void> = new Subject();
  hora2;
  siguiente = false;
  closeResult = '';
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
  horas = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"]
  itemId: string

  constructor(private store: Store<AppState>, private calendarS: CalendarService, private citaS: CitaService, private router: Router, private modalService: NgbModal, config: NgbModalConfig) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

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
      .subscribe(({ calendar }) => {
        calendar.forEach(item => {
          this.arrayItems.push(item)
        });
      })

    this.store.select("contador")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.pagoTotal = res.pago
        // if (res.reparaciones.length > 0) this.selected = res.reparaciones;
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
    );

  open(content) {
    this.modalService.open(content);
  }

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
        this.siguiente = true;

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
  };

  atras() {
    this.siguiente = false;
  }



  async getEventId(title: string) {
    let fecha = ""
    return new Promise<any>(res => {
      setTimeout(() => {
        for (let i = 0; i < this.arrayItems.length; i++) {
          if (this.arrayItems[i].data.title === title) {
            fecha = this.arrayItems[i].uid
          }
        }
        res(fecha);
      }, 100);
    });
  }


  async handleDateSelect(selectInfo: DateSelectArg) {
    let hoy = new Date().getDate().toString()
    let diaFecha = selectInfo.startStr.substr(8, 2)
    if (!moment().isBefore(selectInfo.startStr) && (hoy != diaFecha)) {
      return;
    }
    // this.modalService.open(this.content)
    // const modalRef = this.modalService.open(this.content, { size: 'lg' });
    // modalRef.componentInstance.hora = this.hora;
    // modalRef.result.then((result) => {
    //     if (result) {                
    //         console.log("trueeee");
    //     }
    // },
    //     (reason) => { })
    // console.log(this.content.nativeElement);
    const title = "Reparación " + this.nombre + Math.random() * 102012
    let idApi = "a";
    this.getEventId(title).then(value => {
      idApi = value
      console.log("value" + value);
    })

    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection
    if (title) {
      this.calendarS.crearFecha({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
      console.log("api" + idApi);

      calendarApi.addEvent({
        id: idApi,
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }

    this.selected.forEach((opcion: Opcion) => {
      this.pagoTotal += opcion.price
    });
    let pagoFinal = 0;
    pagoFinal = Math.round(this.pagoTotal * 1e2) / 1e2

    this.cita = true;
    this.store.dispatch(setPago({ pago: pagoFinal }))
    this.store.dispatch(setReparaciones({ reparacion: this.selected }))
    this.citaS.crearCita(this.selected)
    this.store.dispatch(startCita())
    this.router.navigate(["progreso"])

  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`¿Seguro que quieres eliminar tu cita? '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
      console.log(clickInfo.event.id);
      // this.calendarS.borrarFecha(clickInfo.event.id)
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
