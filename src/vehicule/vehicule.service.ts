import { BadRequestException, HttpCode, Injectable, Logger } from '@nestjs/common';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicule } from './entities/vehicule.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { v4 as uuidV4, validate } from 'uuid';
import { STATUS_CODES } from 'http';

@Injectable()
export class VehiculeService {

	private readonly logger: Logger = new Logger(VehiculeService.name);

	constructor(
		@InjectRepository(Vehicule)
		private readonly vehiculeRepository: Repository<Vehicule>,
		private readonly userService: UserService
	) { }

	private handleException(error: any) {
		if (error.code === '23505') {
			this.logger.error(`Error de llave repetida la matricula ya existe details: ${error.detail}`);
			throw new BadRequestException(`Error de llave repetida ${error.detail}`);
		}
		else {
			console.log({ error });
		}
	}

	async create(createVehiculeDto: CreateVehiculeDto) {
		const { owner, ...vehiculeDetails } = createVehiculeDto;
		const user = await this.userService.findOne(owner);
		if (user.rol !== 'cliente') {
			throw new BadRequestException(`El usuario ${user.userName} no esta registrado como cliente`);
		}
		try {
			const vehicule = this.vehiculeRepository.create({ owner: user, id: uuidV4(), ...vehiculeDetails });
			await this.vehiculeRepository.insert(vehicule);
			return await this.plainVehicule(vehicule);
		} catch (error) {
			this.handleException(error);
		}
	}

	async findAll() {
		return await this.vehiculeRepository.find({
			relations: { owner: true },
			select: {
				brand: true,
				model: true,
				registration: true,
				owner: {
					fullName: true,
					userName: true,
					rol: true
				}
			}
		});
	}

	async findOnePlain(term: string) {
		return this.plainVehicule(
			await this.findOne(term)
		);
	}

	async plainVehicule(vehicule: Vehicule) {
		const { id, owner, ...vehiculeProps } = vehicule;
		const { vehicules, ...userProps } = await this.userService.findOnePlain(owner.userName);
		return {
			...vehiculeProps,
			owner: userProps
		}
	}

	async findOne(term: string) {
		let whereOption: FindOptionsWhere<Vehicule> = {};
		if (validate(term)) {
			whereOption = { id: term };
		}
		else {
			whereOption = { registration: term };
		}
		const vehicule = await this.vehiculeRepository.findOne({ where: whereOption, relations: { owner: true } });
		if (vehicule === null) {
			this.logger.error(`No existe el vehiculo ${term}`);
			throw new BadRequestException(`No existe el vehiculo ${term}`);
		}
		return vehicule;

	}

	async update(term: string, updateVehiculeDto: UpdateVehiculeDto) {
		const vehicule = await this.findOne(term);
		const { owner, ...updateProps } = updateVehiculeDto;
		try {
			const updatedVehicule = await this.vehiculeRepository.preload({ id: vehicule.id, ...updateProps });
			const { id } = await this.vehiculeRepository.save(updatedVehicule);
			return await this.findOnePlain(id);
		} catch (error) {
			this.handleException(error);
		}
	}

	async remove(term: string) {
		const vehicule = await this.findOne(term);
		await this.vehiculeRepository.remove(vehicule);
		return this.plainVehicule(vehicule);
	}
}
