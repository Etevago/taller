import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'select'
})
export class SelectPipe implements PipeTransform {

  transform(value: string): string {
    let viewValue: string;
    switch (value) {
      case "0": viewValue = "Cambiar correas de servicio" ; break;
      case "1": viewValue = "Cambiar correa de distribución"; break;
      case "2": viewValue = "Cambiar polea tensora de correa servicios"; break;
      case "3": viewValue = "Cambiar kit de embrague"; break;
      case "4": viewValue = "Cambiar correa de distribución"; break;
      case "5": viewValue = "Cambiar disco de embrague"; break;
      case "6": viewValue = "Cambiar filtro de aceite"; break;
      case "7": viewValue = "Cambiar filtro de aire"; break;
      case "8": viewValue = "Cambiar aceite caja de cambios"; break;
      case "9": viewValue = "Cambiar anticongelante"; break;
      case "10": viewValue = "Cambiar líquido de frenos"; break;
      case "11": viewValue = "Cambiar aceite de motor"; break;
      case "12": viewValue = "Cambiar amortiguadores delanteros"; break;
      case "13": viewValue = "Cambiar amortiguadores traseros"; break;
      case "14": viewValue = "Cambiar pastillas de freno delanteras"; break;
      case "15": viewValue = "Cambiar pastillas de freno traseras"; break;
      case "16": viewValue = "Cambiar discos de freno delanteros"; break;
      case "17": viewValue = "Cambiar discos de freno traseros"; break;
      
    }
    return viewValue;
  }

}
