import { BadRequestException, Injectable } from '@nestjs/common';
import { OcupationService } from 'src/ocupation/ocupation.service';
import { ReservationService } from 'src/reservation/reservation.service';
import { Ocupation } from 'src/ocupation/entities/ocupation.entity';
import { PlainCheckIn } from './entities/check_in.plain';
import { VehiculeService } from 'src/vehicule/vehicule.service';
import { PlainCheckOut } from './entities/check_out.plain';
import { CommonService } from 'src/common/common.service';
import { getDateAfterTime, getTimeBetween } from 'src/common/utils/date-manage';
import { LogService } from 'src/log/log.service';
import { TypeLog } from 'src/log/entities/type.log';

@Injectable()
export class CheckingService {

  constructor(
    private readonly ocupationService: OcupationService,
    private readonly reservationService: ReservationService,
    private readonly vehiculeService: VehiculeService,
    private readonly logService: LogService,
    private readonly commonService: CommonService) { }

  async checkIn(reservationId: number) {
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
      const ocupation = await this.ocupationService.create({
        dateTime: date,
        place: reservation.place,
        vehicule: reservation.vehicule,
        reservation: reservation
      });
      await this.logService.create({
        userName: reservation.vehicule.user.userName,
        reservationId: reservation.publicId,
        type: TypeLog.check_in
      })
      return this.plainCheckIn(ocupation);
    }
    else {
      if (ocupation !== null) {
        if (ocupation.reservation.publicId === reservation.publicId) {
          throw new BadRequestException(`El vehiculo ${ocupation.vehicule.registration} ya se encuentra ocupando la plaza`)
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

  async checkOut(vehiculeRegistration: string) {
    const vehicule = await this.vehiculeService.findOne(vehiculeRegistration);
    try {
      const ocupation = await this.ocupationService.findOne(vehicule.registration);
      await this.ocupationService.remove(vehicule.registration);
      const ocupationStartDate = new Date(`${ocupation.startDate} ${ocupation.startTime}`);
      const endReservedDate = getDateAfterTime(
        ocupationStartDate,
        ocupation.reservation.time
      );

      const reservedTime = getTimeBetween(
        ocupationStartDate,
        endReservedDate
      );

      const extendedTime = getTimeBetween(
        endReservedDate,
        new Date()
      );

      const plainCheckOut: PlainCheckOut = {
        vehiculeRegistration: ocupation.vehicule.registration,
        placeName: ocupation.place.name,
        userName: ocupation.vehicule.user.userName,
        startDate: new Date(`${ocupation.startDate} ${ocupation.startTime}`),
        endDate: new Date(),
        timeReserved: reservedTime,
        timeExtended: extendedTime
      }

      await this.logService.create({
        userName: vehicule.user.userName,
        reservationId: ocupation.reservation.publicId,
        type: TypeLog.check_out
      })

      await this.reservationService.desactiveReservation(ocupation.reservation.publicId);
      return plainCheckOut;
    } catch (error) {
      throw new BadRequestException(`No existe una plaza ocupada por el vehiculo: ${vehiculeRegistration}`);
    }
  }

  plainCheckIn(ocupation: Ocupation): PlainCheckIn {
    return {
      placeName: ocupation.place.name,
      userName: ocupation.vehicule.user.userName,
      vehiculeRegistration: ocupation.vehicule.registration,
      date: ocupation.startDate
    }
  }
}
