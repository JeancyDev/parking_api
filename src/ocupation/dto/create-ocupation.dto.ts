import { Place } from "src/place/entities/place.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";
import { Vehicule } from "src/vehicule/entities/vehicule.entity";

export class CreateOcupationDto {
    place: Place;
    dateTime: Date;
    reservation: Reservation;
}
