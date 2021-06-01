import { Fecha } from './../models/fecha.model';
import { createAction, props } from '@ngrx/store';

export const unSetCalendar = createAction('[Calendar] Unset Items');
export const setCalendar = createAction('[Calendar] Set Items',
    props<{ items: Fecha[] }>());
export const setGeneral = createAction('[General] Set Items',
    props<{ items: Fecha[] }>());