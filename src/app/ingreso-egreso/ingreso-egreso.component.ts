import { takeUntil } from 'rxjs/operators';
import { isLoading, stopLoading } from './../shared/ui.actions';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import Swal from 'sweetalert2';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';
import { Subscription, Subject } from 'rxjs';



@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  loadingSubs: Subscription;
  pagoTotal: number
  pago: string;

  public payPalConfig?: IPayPalConfig;
  showSuccess: boolean;

  constructor(private fb: FormBuilder,
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.initConfig();


    this.store.select('ui')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ isLoading }) => this.cargando = isLoading);

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      cantidad: ['', Validators.required],
    });

    this.store.select("contador")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ pago }) => this.pagoTotal = pago);

    this.pago = this.pagoTotal.toString()
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
              value: this.pago,
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: this.pago
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
                  value: this.pago,
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
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
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
