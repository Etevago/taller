import { DashboardService } from './../../dashboard/dashboard.service';
import { Router } from '@angular/router';
import { startCita, setContador } from './../progreso/progreso.actions';
import Swal from 'sweetalert2';
import { AppState } from '../../app.reducer';
import { filter, takeUntil } from 'rxjs/operators';
import { CalendarService } from '../../services/calendar.service';
import { Subject } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewEncapsulation, ElementRef, ViewChild, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { CalendarOptions, DateSelectArg, EventApi } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import { FormControl } from '@angular/forms';
import { setPago } from '../progreso/progreso.actions';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

interface Opcion {
  value: string;
  price: number;
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
  @Input() public horaSeleccionada;

  private unsubscribe: Subject<void> = new Subject();
  hora2;
  siguiente = false;
  closeResult = '';
  pagoTotal = 0;
  suma = 0;
  cita = false;
  cargando = true
  nombre: string;
  uid: string;
  coleccion;
  currentEvents: EventApi[] = [];
  iniciales = [];
  selected: any[] = []
  arrayItems = []
  arrayGeneral = []
  horas = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"]
  itemId: string;
  sumaFinal;
  fecha;
  bien = true

  constructor(private store: Store<AppState>, private calendarS: CalendarService, private router: Router, private modalService: NgbModal, config: NgbModalConfig, private ds: DashboardService) {
    config.backdrop = 'static';
    config.keyboard = false;
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

      this.selected.forEach(option => {
        this.suma += option.price
      });

      this.store.select("user")
        .pipe(takeUntil(this.unsubscribe),
          filter(auth => auth.user != null)
        )
        .subscribe(({ user }) => {
          this.nombre = user?.nombre
          this.uid = user?.uid
          this.calendarS.initCalendarListener(user.uid)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((calendarFB: any) => {
              calendarFB.forEach(fecha => {
                this.iniciales.push(fecha.data)
              });
              this.calendarOptions.events = this.iniciales
            })
        });

      this.store.select("items")
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((items) => {
          items.calendar.forEach(item => {
            this.arrayItems.push(item)
          });
          items.general.forEach(item => {
            this.arrayGeneral.push(item)
          });

        })

      this.store.select("contador")
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          this.cita = res.cita
        });
      Swal.close()
      this.cargando = false
    }, 1000);

  }

  confirmar() {
    let suma = 0;
    this.sumaFinal = "";
    this.selected.forEach((opcion: Opcion) => {
      suma += opcion.price
    });
    this.sumaFinal = suma.toFixed(2)
    Swal.fire({
      title: 'Pago total: ' + this.sumaFinal + "€",
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
    eventsSet: this.handleEvents.bind(this)
  };

  atras() {
    this.siguiente = false;
  }

  async handleDateSelect(selectInfo: DateSelectArg) {
    let hoy = new Date().getDate().toString()
    let diaFecha = selectInfo.startStr.substr(8, 2)
    this.fecha = selectInfo.startStr
    if (!moment().isBefore(selectInfo.startStr) && (hoy != diaFecha)) {
      this.bien = false
      return
    } else {
      this.bien = true
    }

    this.arrayItems.forEach(reparacion => {
      if (this.bien == false) return
      if (reparacion.data.start == selectInfo.startStr) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El dia seleccionado ya esta completo',
        })
        this.bien = false
        return
      } else {
        this.bien = true
      }
    });

    this.arrayGeneral.forEach(reparacion => {
      if (this.bien == false) return
      if (reparacion.data.start == selectInfo.startStr) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El dia seleccionado ya esta completo',
        })
        this.bien = false
        return
      } else {
        this.bien = true
      }
    });

    if (this.bien) {
      const modalRef = this.modalService.open(this.content);
      modalRef.result.then((result) => {
        if (result) {

          const title = "Reparación " + this.nombre + " " + result
          let idApi = (Math.random() * 999999).toString();

          const calendarApi = selectInfo.view.calendar;

          calendarApi.unselect();
          this.calendarS.crearFecha({
            title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay,
            finalizada: false,
            reparaciones: this.selected,
            pagada: false,
            visibles: [],
            costeTotal: this.sumaFinal
          });

          calendarApi.addEvent({
            id: idApi,
            title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
          });

          this.selected.forEach((opcion: Opcion) => {
            this.pagoTotal += opcion.price
          });
          let pagoFinal = 0;
          pagoFinal = Math.round(this.pagoTotal * 1e2) / 1e2

          this.cita = true;
          this.store.dispatch(setPago({ pago: pagoFinal }))
          this.store.dispatch(startCita())
          this.store.dispatch(setContador({ actual: 0 }))
          this.router.navigate(["progreso"])
        }
      })
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
