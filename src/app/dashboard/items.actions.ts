import { Fecha } from './../models/fecha.model';
import { createAction, props } from '@ngrx/store';

export const unSetItems = createAction('[Calendar] Unset Items');
export const setItems = createAction('[Calendar] Set Items',
    props<{ items: Fecha[] }>());