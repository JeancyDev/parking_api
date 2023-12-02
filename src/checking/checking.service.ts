import { BadRequestException, Injectable } from '@nestjs/common';
import { OcupationService } from 'src/ocupation/ocupation.service';
import { ReservationService } from 'src/reservation/reservation.service';
import { Ocupation } from 'src/ocupation/entities/ocupation.entity';
import { PlainCheckIn } from './entities/check_in.plain';
import { PlainCheckOut } from './entities/check_out.plain';
import { getDateAfterTime, getTimeBetween } from 'src/common/utils/date-manage';
import { LogService } from 'src/log/log.service';
import { TypeLog } from 'src/log/entities/type.log';

@Injectable()
export class CheckingService {

  constructor(
    private readonly ocupationService: OcupationService,
    private readonly reservationService: ReservationService,
    private readonly logService: LogService) { }

  async checkIn(reservationId: number): Promise<PlainCheckIn> {
    const reservation = await this.reservationService.findOne(reservationId);
    let avilable = false;
    let ocupation: Ocupation = null;
    try {
      ocupation = await this.ocupationService.findOne(reservation.place.name);
      avilable = false;
    } catch (error) {
      avilable = true;
    }
    if (avilable) {
      let date: Date = new Date()
      await this.logService.create({
        userName: reservation.vehicule.user.userName,
        reservationId: reservation.publicId,
        type: TypeLog.check_in
      })
      return {
        date: date,
        placeName: reservation.place.name,
        reservationId: reservation.publicId,
        userName: reservation.vehicule.user.userName,
        vehiculeRegistration: reservation.vehicule.registration
      };
    }
    else {
      if (ocupation !== null) {
        if (ocupation.reservation.publicId === reservation.publicId) {
          throw new BadRequestException(`El vehiculo ${ocupation.reservation.vehicule.registration} ya se encuentra ocupando la plaza`)
        } else {
          await this.reservationService.desactiveReservation(reservation.publicId);
          await this.logService.create({
            userName: reservation.vehicule.user.userName,
            reservationId: reservation.publicId,
            type: TypeLog.cancelar
          });
          throw new BadRequestException(
            `La plaza ${reservation.place.name} se encuentra ocupada por otro vehiculo, la reserva ha sido anulada`
          );
        }
      }

    }
  }

  async checkOut(reservationId: number) {
    const reservation = await this.reservationService.findOne(reservationId);
    try {
      const ocupation = await this.ocupationService.findOne(reservation.place.name);
      await this.ocupationService.remove(reservation.place.name);
      const ocupationStartDate: number = new Date(`${ocupation.startDate} ${ocupation.startTime}`).getTime();
      const endReservedDate = getDateAfterTime(
        ocupationStartDate,
        ocupation.reservation.time
      );

      const reservedTime = getTimeBetween(
        ocupationStartDate,
        endReservedDate
      );

      let extendedTime = getTimeBetween(
        endReservedDate
      );

      const plainCheckOut: PlainCheckOut = {
        reservationId: reservationId,
        vehiculeRegistration: ocupation.reservation.vehicule.registration,
        placeName: ocupation.place.name,
        userName: ocupation.reservation.vehicule.user.userName,
        startDate: new Date(`${ocupation.startDate} ${ocupation.startTime}`),
        endDate: new Date(),
        timeReserved: reservedTime,
        timeExtended: extendedTime < 0 ? 0 : extendedTime
      }

      await this.logService.create({
        userName: reservation.vehicule.user.userName,
        reservationId: ocupation.reservation.publicId,
        type: TypeLog.check_out
      })

      await this.reservationService.desactiveReservation(ocupation.reservation.publicId);
      return plainCheckOut;
    } catch (error) {
      throw new BadRequestException(`No existe una plaza ocupada por el vehiculo: ${reservation.vehicule.registration}`);
    }
  }
}
