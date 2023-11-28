import { PlainPlace } from "src/place/entities/place.plain";
import { PlainVehicule } from "src/vehicule/entities/vehicule.plain";

export class PlainReservation {
    publicId: number;
    startDate: Date;
    startTime: Date;
    time: number;
    vehiculeRegistration: string;
    placeName: string;
}