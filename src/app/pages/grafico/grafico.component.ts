import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';


@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.css']
})
export class GraficoComponent implements OnInit {
  
  reparaciones = []
  cargando = true;
  costes = []
  citas = []
  lineChartData: ChartDataSets[]
  private unsubscribe: Subject<void> = new Subject();
  public lineChartLabels: Label[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  constructor(private store: Store<AppState>) { }

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
          this.reparaciones = calendar
          console.log(this.reparaciones);
          for (let i = 0; i < 12; i++) {
            let pago = 0
            let cita = 0
            this.reparaciones.forEach(reparacion => {
              const mes = (reparacion.data.start).substring(5, 7)
              if (mes == i) {
                pago += Number(reparacion.data.costeTotal)
                cita++
              }
            });
            console.log(pago);
            this.costes.push(pago)
            this.citas.push(cita)
          }
          this.lineChartData= [
            { data: [this.costes[0], this.costes[1], this.costes[2], this.costes[3], this.costes[4], this.costes[5], this.costes[6], this.costes[7], this.costes[8], this.costes[9], this.costes[10], this.costes[11]], label: 'Coste Total' },
            { data: [this.citas[0], this.citas[1], this.citas[2], this.citas[3], this.citas[4], this.citas[5], this.citas[6], this.citas[7], this.citas[8], this.citas[9], this.citas[10], this.citas[11],], label: 'Nº Citas', yAxisID: 'y-axis-1' },
        
          ];
        })
      Swal.close()
      this.cargando = false
    }, 1000);
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }
}
