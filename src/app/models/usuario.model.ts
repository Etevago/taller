export class Usuario {

    static fromFirebase({ email, uid, nombre, contador, tiempo, reparando }) {
        return new Usuario(uid, nombre, email, contador, tiempo, reparando)
    }


    constructor(public uid: string, public nombre: string, public email: string, public contador: number, public tiempo: number, public reparando: boolean) {

    }
}