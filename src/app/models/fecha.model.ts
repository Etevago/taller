export class Fecha {
    constructor(
        public title: string,
        public start: string,
        public end: string,
        public costeTotal: number,
        public allDay: boolean,
        public finalizada: boolean,
        public pagada: boolean,
        public reparaciones: any[],
        public visibles: any[],
    ) { }
}