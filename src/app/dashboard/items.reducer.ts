import { Reparacion } from './../models/reparacion.model';
import { Fecha } from './../models/fecha.model';
import { setCalendar, unSetCalendar, setCitas, unSetCitas } from './items.actions';
import { createReducer, on } from '@ngrx/store';
import { AppState } from '../app.reducer';

export interface State {
    calendar: Fecha[];
    reparaciones: Reparacion[]
}

export interface AppStateCalendar extends AppState {
    calendarItems: State;
}

export const initialState: State = {
    calendar: [],
    reparaciones: []
}

const _itemsReducer = createReducer(initialState,

    on(setCalendar, (state, { items }) => ({ ...state, calendar: [...items] })),
    on(unSetCalendar, (state) => ({ ...state, calendar: [] })),
    on(setCitas, (state, { items }) => ({ ...state, reparaciones: [...items] })),
    on(unSetCitas, (state) => ({ ...state, reparaciones: [] })),
);

export function itemsReducer(state, action) {
    return _itemsReducer(state, action);
}