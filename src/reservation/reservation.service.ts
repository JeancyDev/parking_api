import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { FindOptionsWhere, Repository, FindOptionsRelations } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { v4 as uuidV4 } from 'uuid';
import { VehiculeService } from 'src/vehicule/vehicule.service';
import { PlaceService } from 'src/place/place.service';
import { getDateAfterTime } from '../common/utils/date-manage';
import { PlainReservation } from './entities/reservation.plain';
import { LogService } from 'src/log/log.service';
import { TypeLog } from 'src/log/entities/type.log';
import { Payload } from 'src/auth/dto/payload';
import { Rol } from 'src/user/entities/user.rol';

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

	async create(createReservationDto: CreateReservationDto, user: string) {
		const startDate: number = new Date(createReservationDto.dateTime).getTime();
		const endDate: number = getDateAfterTime(startDate, createReservationDto.time);
		const vehicule = await this.vehiculeService.findOneByUser(user);
		const place = await this.placeService.findPlaceFree(startDate, endDate);
		const reservation = this.reservationRepository.create({
			id: uuidV4(),
			startDate: new Date(startDate),
			vehicule: vehicule,
			place: place,
			startTime: new Date(startDate),
			time: createReservationDto.time
		})
		reservation.publicId = await this.findLastId();
		reservation.publicId++;
		try {
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
			time: reservation.time,
			placeName: reservation.place.name,
			vehiculeRegistration: reservation.vehicule.registration,
			userName: reservation.vehicule.user.userName
		}
	}

	async findAll(userName?: string) {
		return await this.reservationRepository.find({
			where: { isActive: true, vehicule: { user: { userName: userName } } },
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

	async findAllPlain(user?: Payload) {
		if (user.rol === Rol.admin) {
			return (await this.findAll()).map((reservation) => {
				return this.plainReservation(reservation);
			});
		} else {
			return (await this.findAll(user.userName)).map((reservation) => {
				return this.plainReservation(reservation);
			});
		}
	}

	async findOne(id: number, userName?: string) {
		const relations: FindOptionsRelations<Reservation> = {
			place: true,
			vehicule: { user: true }
		};
		let whereOption: FindOptionsWhere<Reservation> = {};
		if (userName) {
			whereOption = {
				publicId: id,
				isActive: true,
				vehicule: { user: { userName: userName } }
			}
		}
		else {
			whereOption = {
				publicId: id,
				isActive: true,
			};
		}
		if (await this.reservationRepository.exist({ where: whereOption })) {
			return await this.reservationRepository.findOne({ where: whereOption, relations: relations });
		}
		throw new BadRequestException(`No existe una reservacion con el id: ${id}`);
	}

	async findOnePlain(id: number, user?: Payload) {
		if (user) {
			if (user.rol === Rol.admin) {
				return this.plainReservation(await this.findOne(id));
			}
			else if (user.rol === Rol.cliente) {
				return this.plainReservation(await this.findOne(id, user.userName));
			}
		}
	}

	async findLastId() {
		const res = await this.reservationRepository.find({ order: { publicId: { direction: 'DESC' } } });
		if (res.length === 0) {
			return 0;
		} else {
			return res[0].publicId;
		}
	}

	async update(user: string, id: number, updateReservationDto: UpdateReservationDto) {
		const reservation: Reservation = await this.findOne(id, user);
		const start: number = new Date(updateReservationDto.dateTime).getTime();
		const end: number = getDateAfterTime(start, updateReservationDto.time);
		const where: FindOptionsWhere<Reservation> = { id: reservation.id };
		const place = await this.placeService.findPlaceFree(start, end);
		try {
			await this.reservationRepository.update(where, {
				startDate: new Date(start),
				startTime: new Date(start),
				time: updateReservationDto.time,
				place: place
			});
			reservation.startDate = new Date(start);
			reservation.startTime = new Date(start);
			reservation.time = updateReservationDto.time;

			return this.plainReservation(reservation);
		} catch (error) {
			this.commonService.handleException(error, this.logger);
		}
	}

	async desactiveReservation(id: number, user?: string) {
		let reservation: Reservation = undefined;
		if (user) {
			reservation = await this.findOne(id, user);
		} else {
			reservation = await this.findOne(id);
		}
		reservation.isActive = false;
		const where: FindOptionsWhere<Reservation> = { publicId: id }
		await this.reservationRepository.update(where, reservation);
		await this.logService.create({
			userName: reservation.vehicule.user.userName,
			reservationId: reservation.publicId,
			type: TypeLog.cancelar
		})
		return this.plainReservation(reservation);
	}
}
