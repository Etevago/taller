import { CalendarService } from './../../services/calendar.service';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { Store } from '@ngrx/store';
import { Subscription, Subject } from 'rxjs';
import { AppState } from 'src/app/app.reducer';



@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styles: [
    `
  .clearfix {
    float: none;
    clear: both;
  }

  .head {
    overflow: hidden;
    margin: -20px -200px 22px 300px;
    float: left;
    text-align: center;
  }
    `
  ]
})
export class PagoComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  cargando = true;
  loadingSubs: Subscription;
  pagoTotal: number
  pago: string;
  cita: boolean;
  public payPalConfig?: IPayPalConfig;
  showSuccess: boolean;
  reparaciones = [];
  selected;

  constructor(
    private store: Store<AppState>,
    private calS: CalendarService
  ) { }

  ngOnInit() {
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      },
      allowOutsideClick: false

    })
    setTimeout(() => {
      this.initConfig();
      this.store.select("contador")
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((cont) => {
          this.cita = cont.cita
        });

      this.store.select("items")
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(({ calendar }) => {
          this.reparaciones = []
          calendar.forEach((reparacion: any) => {
            if (!reparacion.data.pagada) {
              this.reparaciones.push(reparacion)
            }
          });
        });

      this.pago = this.selected?.data.costeTotal.toFixed(2).toString()
      Swal.close()
      this.cargando = false
    }, 1000);

  }

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()

  }


  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'ATUxo4wf2u6rKfTtxMGgNvoRkAXpug_DM3RUM8BHi84mer7TyCjwVdLz9UlG7fh-bIIQGpiikSNobnO4',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: "0.01",
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: "0.01"
                }
              }
            },
            items: [
              {
                name: 'Reparacion coche',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: "0.01",
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
        this.calS.pagarFecha(this.selected?.uid)
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.calS.pagarFecha(this.selected?.uid)
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

}
