import { Reparacion } from './../models/reparacion.model';
import { Fecha } from './../models/fecha.model';
import { createAction, props } from '@ngrx/store';

export const unSetCalendar = createAction('[Calendar] Unset Items');
export const setCalendar = createAction('[Calendar] Set Items',
    props<{ items: Fecha[] }>());
export const unSetCitas = createAction('[Cita] Unset Cita');
export const setCitas = createAction('[Cita] Set Citas',
    props<{ items: Reparacion[] }>());