import { createAction, props } from '@ngrx/store';

export const contador = createAction('[Contador] Sumar Contador');
export const startContador = createAction('[Contador] Empezar Contador');
export const stopContador = createAction('[Contador] Parar Contador');
export const setContador = createAction('[Contador] Establecer Contador', props<{ actual: number }>());
export const reparar = createAction('[Contador] Empezar Reparar');
export const stopReparar = createAction('[Contador] Parar Reparar');
