import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumar'
})
export class SumarPipe implements PipeTransform {

  transform(price: number): number {
    let arr = [];
    let total;
    arr.push(price)
    arr.forEach(precio => {
      total += precio
    });
    return total;
  }

}
