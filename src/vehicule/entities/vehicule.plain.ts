import { PlainUser } from "src/user/entities/user.plain";

export class PlainVehicule {
    brand: string;
    model: string;
    registration: string;
    owner?: PlainUser;
}