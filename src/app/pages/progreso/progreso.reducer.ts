import { createReducer, on } from '@ngrx/store';
import { contador, setContador, reparar, stopReparar, stopContador, startContador, setPago, setReparaciones, stopCita, startCita } from './progreso.actions';

export interface State {
    cont: number
    user: string
    reparando: boolean
    parar: boolean
    pago: number
    reparaciones: any[]
    cita: boolean;
}

export const initialState: State = {
    cont: 0,
    user: "",
    reparando: false,
    parar: false,
    pago: 0,
    reparaciones: [],
    cita: false
}

const _contadorReducer = createReducer(initialState,

    on(setContador, (state, { actual }) => ({ ...state, cont: actual })),
    on(contador, state => ({ ...state, cont: state.cont + 1 })),
    on(stopContador, state => ({ ...state, parar: true })),
    on(startContador, state => ({ ...state, parar: false })),
    on(reparar, state => ({ ...state, reparando: true })),
    on(stopReparar, state => ({ ...state, reparando: false })),
    on(setPago, (state, { pago }) => ({ ...state, pago: pago })),
    on(setReparaciones, (state, { reparaciones }) => ({ ...state, reparaciones: [...reparaciones] })),
    on(startCita, state => ({ ...state, cita: true })),
    on(stopCita, state => ({ ...state, cita: false })),



);

export function contadorReducer(state, action) {
    return _contadorReducer(state, action);
}