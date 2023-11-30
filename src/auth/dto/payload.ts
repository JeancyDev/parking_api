import { Rol } from "src/user/entities/user.rol";

export class Payload {
    sub: string;
    userName: string;
    rol: Rol;
    iat: number;
    exp: number;
}