import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { v4 as uuidV4 } from 'uuid';
import { VehiculeService } from 'src/vehicule/vehicule.service';
import { PlaceService } from 'src/place/place.service';
import { SimpleDateDto, getDateForSimple, getDateAfterTime, getSimpleDate, getSimpleTime, isDateBetween, getDateForDate } from '../common/utils/date-manage';
import { PlainReservation } from './entities/reservation.plain';
import { Place } from 'src/place/entities/place.entity';
import { LogService } from 'src/log/log.service';
import { TypeLog } from 'src/log/entities/type.log';

@Injectable()
export class ReservationService {

	private readonly logger: Logger = new Logger(ReservationService.name);
	constructor(
		@InjectRepository(Reservation)
		private readonly reservationRepository: Repository<Reservation>,
		private readonly vehiculeService: VehiculeService,
		private readonly placeService: PlaceService,
		private readonly logService: LogService,
		private readonly commonService: CommonService) { }

	async create(createReservationDto: CreateReservationDto) {
		const startDate: Date = new Date(createReservationDto.dateTime);
		const endDate: Date = getDateAfterTime(startDate, createReservationDto.time);
		const vehicule = await this.vehiculeService.findOne(createReservationDto.vehiculeRegistration);

		const place = await this.placeService.findPlaceFree(startDate, endDate);
		const reservation = this.reservationRepository.create({
			id: uuidV4(),
			startDate: startDate,
			vehicule: vehicule,
			place: place,
			startTime: startDate,
			time: createReservationDto.time
		})
		try {
			reservation.publicId = await this.findLastId() + 1;
			await this.reservationRepository.insert(reservation);

			await this.logService.create({
				userName: reservation.vehicule.user.userName,
				reservationId: reservation.publicId,
				type: TypeLog.reservar
			});
		} catch (error) {
			this.commonService.handleException(error, this.logger);
		}
		return this.plainReservation(reservation);
	}

	plainReservation(reservation: Reservation): PlainReservation {
		return {
			publicId: reservation.publicId,
			startDate: reservation.startDate,
			startTime: reservation.startTime,
			time: reservation.time,
			placeName: reservation.place.name,
			vehiculeRegistration: reservation.vehicule.registration
		}
	}

	async findAll() {
		return await this.reservationRepository.find({
			where: { isActive: true },
			relations: {
				place: true,
				vehicule: {
					user: true
				}
			},
			order: {
				publicId: { direction: 'ASC' }
			}
		});
	}

	async findAllPlain() {
		return (await this.findAll()).map((reservation) => {
			return this.plainReservation(reservation);
		});
	}

	async findOne(id: number) {
		if (await this.reservationRepository.exist({ where: { publicId: id, isActive: true } })) {
			return await this.reservationRepository.findOne({ where: { publicId: id, isActive: true }, relations: { place: true, vehicule: { user: true } } })
		}
		else {
			throw new BadRequestException(`No existe una reservacion con el id: ${id}`);
		}
	}

	async findOnePlain(id: number) {
		const reservation = await this.findOne(id);
		return this.plainReservation(reservation);
	}

	async findLastId() {
		const res = await this.reservationRepository.find({ order: { publicId: { direction: 'ASC' } } });
		if (res.length === 0) {
			return 0;
		} else {
			return res[0].publicId;
		}
	}

	async update(id: number, updateReservationDto: UpdateReservationDto) {
		const reservation = await this.findOne(id);
		const start = new Date(updateReservationDto.dateTime);
		const end = getDateAfterTime(start, updateReservationDto.time);
		const where: FindOptionsWhere<Reservation> = { id: reservation.id };
		const place = await this.placeService.findPlaceFree(start, end);
		try {
			await this.reservationRepository.update(where, {
				startDate: start,
				startTime: start,
				time: updateReservationDto.time,
				place: place
			});
			reservation.startDate = start;
			reservation.startTime = start;
			reservation.time = updateReservationDto.time;

			return this.plainReservation(reservation);
		} catch (error) {
			this.commonService.handleException(error, this.logger);
		}
	}

	async desactiveReservation(id: number) {
		const reservation = await this.findOne(id);
		reservation.isActive = false;
		const where: FindOptionsWhere<Reservation> = { publicId: id }
		await this.reservationRepository.update(where, reservation);
		await this.logService.create({
			userName: reservation.vehicule.user.userName,
			reservationId: reservation.publicId,
			type: TypeLog.cancelar
		})
	}
}
