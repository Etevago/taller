import { Fecha } from './../models/fecha.model';
import { setCalendar, unSetCalendar } from './items.actions';
import { createReducer, on } from '@ngrx/store';
import { AppState } from '../app.reducer';

export interface State {
    calendar: Fecha[];
}

export interface AppStateCalendar extends AppState {
    calendarItems: State;
}

export const initialState: State = {
    calendar: [],
}

const _itemsReducer = createReducer(initialState,

    on(setCalendar, (state, { items }) => ({ ...state, calendar: [...items] })),
    on(unSetCalendar, (state) => ({ ...state, calendar: [] })),
);

export function itemsReducer(state, action) {
    return _itemsReducer(state, action);
}