import { createAction, props } from '@ngrx/store';

export const contador = createAction('[Contador] Sumar Contador');
export const startContador = createAction('[Contador] Empezar Contador');
export const stopContador = createAction('[Contador] Parar Contador');
export const setContador = createAction('[Contador] Establecer Contador', props<{ actual: number }>());
export const reparar = createAction('[Contador] Empezar Reparar');
export const stopReparar = createAction('[Contador] Parar Reparar');
export const setPago = createAction('[Pago] Establecer Pago', props<{ pago: number }>());
export const setReparaciones = createAction('[Reparaciones] Establecer Reparaciones', props<{ reparacion: any[] }>());
export const setVisibles = createAction('[Reparaciones] Establecer Visibles', props<{ visibles: any[] }>());
export const startCita = createAction('[Cita] Empezar cita');
export const stopCita = createAction('[Cita] Eliminar cita');
export const setUser = createAction('[User] Establecer usuario', props<{ user: string }>());
export const setID = createAction('[Reparacion] Establecer ID reparacion', props<{ id: string }>());
