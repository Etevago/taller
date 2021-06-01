import { Fecha } from './../models/fecha.model';
import { setCalendar, unSetCalendar, setGeneral } from './items.actions';
import { createReducer, on } from '@ngrx/store';
import { AppState } from '../app.reducer';

export interface State {
    calendar: Fecha[];
    general: Fecha[];
}

export interface AppStateCalendar extends AppState {
    calendarItems: State;
}

export const initialState: State = {
    calendar: [],
    general: [],
}

const _itemsReducer = createReducer(initialState,

    on(setCalendar, (state, { items }) => ({ ...state, calendar: [...items] })),
    on(setGeneral, (state, { items }) => ({ ...state, general: [...items] })),
    on(unSetCalendar, (state) => ({ ...state, calendar: [] })),
);

export function itemsReducer(state, action) {
    return _itemsReducer(state, action);
}