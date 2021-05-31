import { setUser } from './../../auth/auth.actions';
import { createReducer, on } from '@ngrx/store';
import { contador, setContador, reparar, stopReparar, stopContador, startContador, setPago, setReparaciones, stopCita, startCita, setID, setVisibles, setTitulo, setDia } from './progreso.actions';

export interface State {
    cont: number
    user: string
    reparando: boolean
    parar: boolean
    pago: number
    reparacion: any[]
    visibles: any[]
    cita: boolean;
    id: string
    titulo: string
    dia: string
}

export const initialState: State = {
    cont: 0,
    user: "",
    reparando: false,
    parar: false,
    pago: 0,
    reparacion: [],
    visibles: [],
    cita: false,
    id: "",
    titulo: "",
    dia: ""
}

const _contadorReducer = createReducer(initialState,

    on(setContador, (state, { actual }) => ({ ...state, cont: actual })),
    on(contador, state => ({ ...state, cont: state.cont + 1 })),
    on(stopContador, state => ({ ...state, parar: true })),
    on(startContador, state => ({ ...state, parar: false })),
    on(reparar, state => ({ ...state, reparando: true })),
    on(stopReparar, state => ({ ...state, reparando: false })),
    on(setPago, (state, { pago }) => ({ ...state, pago: pago })),
    on(setReparaciones, (state, { reparacion }) => ({ ...state, reparacion: [...reparacion] })),
    on(setVisibles, (state, { visibles }) => ({ ...state, visibles: [...visibles] })),
    on(startCita, state => ({ ...state, cita: true })),
    on(stopCita, state => ({ ...state, cita: false })),
    on(setUser, (state, { user }) => ({ ...state, user: user.uid })),
    on(setID, (state, { id }) => ({ ...state, id: id })),
    on(setTitulo, (state, { titulo }) => ({ ...state, titulo: titulo })),
    on(setDia, (state, { dia }) => ({ ...state, dia: dia })),



);

export function contadorReducer(state, action) {
    return _contadorReducer(state, action);
}