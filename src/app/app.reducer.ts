import { ActionReducerMap } from '@ngrx/store';
import * as ui from './shared/ui.reducer';
import * as auth from './auth/auth.reducer';
import * as cont from './ingreso-egreso/estadistica/estadistica.reducer';
import * as it from './dashboard/items.reducer';


export interface AppState {
   ui: ui.State
   user: auth.State
   contador: cont.State
   items: it.State
}



export const appReducers: ActionReducerMap<AppState> = {
   ui: ui.uiReducer,
   user: auth.authReducer,
   contador: cont.contadorReducer,
   items: it.itemsReducer
}