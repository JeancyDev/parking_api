import { Place } from "src/place/entities/place.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";

export class CreateOcupationDto {
    place: Place;
    dateTime: Date;
    reservation: Reservation;
}
