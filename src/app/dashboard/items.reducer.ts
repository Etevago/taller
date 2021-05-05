import { Fecha } from './../models/fecha.model';
import { setItems, unSetItems } from './items.actions';
import { createReducer, on } from '@ngrx/store';
import { AppState } from '../app.reducer';

export interface State {
    items: Fecha[];
}

export interface AppStateCalendar extends AppState {
    calendarItems: State;
}

export const initialState: State = {
    items: [],
}

const _itemsReducer = createReducer(initialState,

    on(setItems, (state, { items }) => ({ ...state, items: [...items] })),
    on(unSetItems, (state) => ({ ...state, items: [] })),

);

export function itemsReducer(state, action) {
    return _itemsReducer(state, action);
}