import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from 'src/place/entities/place.entity';
import { User } from 'src/user/entities/user.entity';
import { Vehicule } from 'src/vehicule/entities/vehicule.entity';
import { Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Rol } from 'src/user/entities/user.rol';

@Injectable()
export class SeedService {

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Vehicule)
		private readonly vehiculeRepository: Repository<Vehicule>,
		@InjectRepository(Place)
		private readonly placeRepository: Repository<Place>,
		@InjectRepository(Reservation)
		private readonly reservationRepository: Repository<Reservation>,
	) { }


	async loadSeed() {
		const places: Place[] = await this.seedPlaces();
		console.log(places);
		const users: User[] = await this.seedUsers();
		console.log(users);
		const vehicules: Vehicule[] = await this.seedVehicules();
		console.log(vehicules);
		const reservations:Reservation[]=await this.seedReservation();
		console.log(reservations);
		return 'Seed ejecutado';
	}

	private async seedPlaces() {
		const places: { name: string }[] = [
			{ name: 'Plaza 1' },
			{ name: 'Plaza 2' },
			{ name: 'Plaza 3' },
			{ name: 'Plaza 4' },
			{ name: 'Plaza 5' },
		];
		await this.placeRepository.delete({});
		const seed = places.map((place) => {
			return this.placeRepository.create({
				id: uuidV4(),
				name: place.name,
			})
		});
		await this.placeRepository.insert(seed);
		return seed;
	}

	private async seedUsers() {
		const users: {
			fullName: string,
			userName: string,
			password: string,
			rol: Rol
		}[] = [
				{
					fullName: 'Alberto Gonzalez',
					password: 'alberto123',
					rol: Rol.cliente,
					userName: 'alberto'
				},
				{
					fullName: 'Francisco Hernandez',
					password: 'francisco123',
					rol: Rol.cliente,
					userName: 'francisco'
				},
				{
					fullName: 'Eduardo Lopez',
					password: 'eduardo123',
					rol: Rol.cliente,
					userName: 'eduardo'
				},
				{
					fullName: 'Dayami Heredia',
					password: 'dayami123',
					rol: Rol.empleado,
					userName: 'dayami'
				},
				{
					fullName: 'Juan Perez',
					password: 'juan123',
					rol: Rol.empleado,
					userName: 'juan'
				},
				{
					fullName: 'Carlos Torres',
					password: 'carlos123',
					rol: Rol.admin,
					userName: 'carlos'
				}
			];
		await this.userRepository.delete({});
		const seed: User[] = users.map((user) => {
			return this.userRepository.create({
				id: uuidV4(),
				fullName: user.fullName,
				password: bcrypt.hashSync(user.password, 10),
				rol: user.rol,
				userName: user.userName
			});
		});
		await this.userRepository.insert(seed);
		return seed;
	}

	private async seedVehicules() {
		await this.vehiculeRepository.delete({});
		const vehicules: {
			brand: string,
			model: string,
			userName: string,
			registration: string
		}[] = [
				{ brand: 'Toyota', model: 'toyota-001', registration: 'ABC-001', userName: 'alberto' },
				{ brand: 'Nissan', model: 'nissan-001', registration: 'ABC-002', userName: 'francisco' },
				{ brand: 'Jeep', model: 'jeep-001', registration: 'ABC-003', userName: 'eduardo' },
			];
		let seed: Vehicule[] = [];
		let i = 0;
		while (i < vehicules.length) {
			let vehicule = vehicules[i];
			const user = await this.userRepository.findOne({ where: { userName: vehicule.userName } });
			const vehiculeDB = this.vehiculeRepository.create({
				id: uuidV4(),
				brand: vehicule.brand,
				model: vehicule.model,
				registration: vehicule.registration,
				user: user
			});
			seed.push(vehiculeDB);
			i++;
		}
		await this.vehiculeRepository.insert(seed);
		return seed;
	}

	private async seedReservation() {
		await this.reservationRepository.delete({});
		const reservations: { publicId: number, date: Date, time: number, registration: string, place: string }[] = [
			{ publicId: 1, date: new Date(), time: 4, registration: 'ABC-001', place: 'Plaza 1' },
			{ publicId: 2, date: new Date(), time: 2, registration: 'ABC-002', place: 'Plaza 2' },
			{ publicId: 3, date: new Date(), time: 3, registration: 'ABC-003', place: 'Plaza 3' },
		];
		let seed: Reservation[] = [];
		let i = 0;
		while (i < reservations.length) {
			const res = reservations[i];
			const vehicule = await this.vehiculeRepository.findOne({ where: { registration: res.registration }, relations: { user: true } });
			const place = await this.placeRepository.findOne({ where: { name: res.place } });
			const reservationDB = this.reservationRepository.create({
				id: uuidV4(),
				isActive: true,
				place: place,
				publicId: res.publicId,
				startDate: res.date,
				startTime: res.date,
				time: res.time,
				vehicule: vehicule
			});
			await this.reservationRepository.insert(reservationDB);
			seed.push(reservationDB);
			i++;
		}
		return seed;
	}
}
