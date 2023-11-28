import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePlaceDto } from 'src/place/dto/create-place.dto';
import { Place } from 'src/place/entities/place.entity';
import { PlaceService } from 'src/place/place.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateVehiculeDto } from 'src/vehicule/dto/create-vehicule.dto';
import { Vehicule } from 'src/vehicule/entities/vehicule.entity';
import { VehiculeService } from 'src/vehicule/vehicule.service';
import { Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Ocupation } from 'src/ocupation/entities/ocupation.entity';
import { privateDecrypt } from 'crypto';
import { CreateOcupationDto } from 'src/ocupation/dto/create-ocupation.dto';
import { CreateReservationDto } from 'src/reservation/dto/create-reservation.dto';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { ReservationService } from 'src/reservation/reservation.service';

@Injectable()
export class SeedService {

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Vehicule)
		private readonly vehiculeRepository: Repository<Vehicule>,
		@InjectRepository(Place)
		private readonly placeRepository: Repository<Place>,
		@InjectRepository(Ocupation)
		private readonly ocupationRepository: Repository<Ocupation>,
		@InjectRepository(Reservation)
		private readonly reservationRepository: Repository<Reservation>,
		private readonly reservationService: ReservationService
	) { }

	private placesDto: CreatePlaceDto[] = [
		{
			name: 'Plaza 1',
		},
		{
			name: 'Plaza 2',
		},
		{
			name: 'Plaza 3',
		},
		{
			name: 'Plaza 4',
		},
		{
			name: 'Plaza 5',
		}
	];

	private usersDto: CreateUserDto[] = [
		{
			fullName: 'Alberto Gonzalez',
			password: 'alberto123',
			rol: 'cliente',
			userName: 'alberto'
		},
		{
			fullName: 'Francisco Hernandez',
			password: 'francisco123',
			rol: 'cliente',
			userName: 'francisco'
		},
		{
			fullName: 'Eduardo Lopez',
			password: 'eduardo123',
			rol: 'cliente',
			userName: 'eduardo'
		},
		{
			fullName: 'Dayami Heredia',
			password: 'dayami123',
			rol: 'empleado',
			userName: 'dayami'
		},
		{
			fullName: 'Juan Perez',
			password: 'juan123',
			rol: 'empleado',
			userName: 'juan'
		},
		{
			fullName: 'Carlos Torres',
			password: 'carlos123',
			rol: 'administrador',
			userName: 'carlos'
		}
	];

	private vehiculesDto: CreateVehiculeDto[] = [
		{
			brand: 'Audi',
			model: 'audi001',
			owner: 'alberto',
			registration: 'ABC-001'
		},
		{
			brand: 'Nissan',
			model: 'nissan001',
			owner: 'francisco',
			registration: 'ABC-002'
		},
		{
			brand: 'Toyota',
			model: 'toyota001',
			owner: 'eduardo',
			registration: 'ABC-003'
		}
	];
	private reservationDto: CreateReservationDto[] = [
		{
			dateTime: new Date(),
			time: 3,
			vehiculeRegistration: 'ABC-001'
		},
		{
			dateTime: new Date(),
			time: 4,
			vehiculeRegistration: 'ABC-002'
		},
		{
			dateTime: new Date(),
			time: 6,
			vehiculeRegistration: 'ABC-003'
		},
	];
	async loadSeed() {
		const places: Place[] = await this.seedPlaces(this.placesDto);
		const users: User[] = await this.seedUsers(this.usersDto);
		const vehicules: Vehicule[] = await this.seedVehicules(this.vehiculesDto, users);
		// await this.seedReservation(this.reservationDto);
		// const ocupationDto: CreateOcupationDto[] = [];
		// const ocupations: Ocupation[] = await this.seedOcupation(ocupationDto);
		return 'Seed ejecutado';
	}

	private async seedReservation(reservationDto: CreateReservationDto[]) {
		await this.reservationRepository.delete({});
		reservationDto.forEach(
			async (reservation) => {
				await this.reservationService.create(reservation);
			});
	}

	private async seedOcupation(ocupationDto: CreateOcupationDto[]) {
		await this.ocupationRepository.delete({});
		const seed = ocupationDto.map((ocupation) => {
			return this.ocupationRepository.create({
				id: uuidV4(),
				startDate: ocupation.dateTime,
				startTime: ocupation.dateTime,
				place: ocupation.place,
				vehicule: ocupation.vehicule
			})
		});
		await this.ocupationRepository.insert(seed);
		return seed;
	}

	private async seedPlaces(placesDto: CreatePlaceDto[]) {
		await this.placeRepository.delete({});
		const seed = placesDto.map((place) => {
			return this.placeRepository.create({
				id: uuidV4(),
				name: place.name,
				reservations: []
			})
		});
		await this.placeRepository.insert(seed);
		return seed;
	}

	private async seedVehicules(vehiculesDto: CreateVehiculeDto[], users: User[]) {
		await this.vehiculeRepository.delete({});
		const seed = vehiculesDto.map((vehicule) => {
			return this.vehiculeRepository.create({
				brand: vehicule.brand,
				id: uuidV4(),
				model: vehicule.model,
				registration: vehicule.registration,
				reservations: [],
				user: users.find((user) => { return user.userName === vehicule.owner })
			});
		});
		await this.vehiculeRepository.insert(seed);
		return seed;
	}

	private async seedUsers(usersDto: CreateUserDto[]): Promise<User[]> {
		await this.userRepository.delete({});
		const seed: User[] = usersDto.map((user) => {
			return this.userRepository.create({
				id: uuidV4(),
				fullName: user.fullName,
				rol: user.rol,
				userName: user.userName,
				password: bcrypt.hashSync(user.password, 10)
			})
		})
		await this.userRepository.insert(seed);
		return seed;
	}
}
