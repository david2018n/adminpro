import { Usuario } from '../models/usuario.model';
export interface CargarUsuario {
    paged: {
        total: number
    };
    usuarios: Usuario[];
}