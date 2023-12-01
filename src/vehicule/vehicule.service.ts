import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicule } from './entities/vehicule.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { v4 as uuidV4, validate } from 'uuid';
import { UserService } from 'src/user/user.service';
import { PlainVehicule } from './entities/vehicule.plain';
import { CommonService } from 'src/common/common.service';
import { FindVehiculeDto } from './dto/find-vehicule.dto';
import { Payload } from 'src/auth/dto/payload';

@Injectable()
export class VehiculeService {

	private readonly logger: Logger = new Logger(VehiculeService.name);

	constructor(
		@InjectRepository(Vehicule)
		private readonly vehiculeRepository: Repository<Vehicule>,
		private readonly userService: UserService,
		private readonly commonService: CommonService
	) { }

	async create(userName: string, createVehiculeDto: CreateVehiculeDto) {
		const user = await this.userService.findOne(userName);
		const vehicule = this.vehiculeRepository.create({
			user: user,
			id: uuidV4(),
			brand: createVehiculeDto.brand,
			model: createVehiculeDto.model,
			registration: createVehiculeDto.registration
		});
		try {
			await this.vehiculeRepository.insert(vehicule);
		} catch (error) {
			this.commonService.handleException(error, this.logger);
		}
		return await this.plainVehicule(vehicule);
	}

	async findAll() {
		return await this.vehiculeRepository.find({
			relations: { user: true },
			select: {
				brand: true,
				model: true,
				registration: true,
				user: {
					fullName: true,
					userName: true,
					rol: true
				}
			}
		});
	}

	async findOnePlain(registration: string) {
		return this.plainVehicule(
			await this.findOneByRegistration(registration)
		);
	}

	async plainVehicule(vehicule: Vehicule) {
		const plain: PlainVehicule = {
			brand: vehicule.brand,
			model: vehicule.model,
			registration: vehicule.registration,
		}
		return plain;
	}

	async findOneByUser(user: string) {
		if (await this.vehiculeRepository.exist({ where: { user: { userName: user } } })) {
			return await this.vehiculeRepository.findOne({ where: { user: { userName: user } }, relations: { user: true } });
		} else {
			this.logger.error(`El usuario: ${user} no tiene vehiculo registrado`);
			throw new NotFoundException(`El usuario: ${user} no tiene vehiculo registrado`);
		}
	}
	async findOneByRegistration(registration: string) {
		if (await this.vehiculeRepository.exist({ where: { registration: registration } })) {
			return await this.vehiculeRepository.findOne({ where: { registration: registration }, relations: { user: true } });
		} else {
			this.logger.error(`No existe el vehiculo: ${registration}`);
			throw new NotFoundException(`No existe el vehiculo ${registration}`);
		}
	}

	async update(user: string, registration: string, updateVehiculeDto: UpdateVehiculeDto) {
		await this.validateUserVehicule(user, registration);
		const vehicule = await this.findOneByRegistration(registration);
		try {
			const updatedVehicule = await this.vehiculeRepository.preload({
				id: vehicule.id,
				brand: updateVehiculeDto.brand,
				model: updateVehiculeDto.model,
				registration: updateVehiculeDto.registration
			});
			const where: FindOptionsWhere<Vehicule> = { id: vehicule.id };
			await this.vehiculeRepository.update(where, updatedVehicule);
			return this.plainVehicule(updatedVehicule);
		} catch (error) {
			this.commonService.handleException(error, this.logger);
		}
	}

	async remove(user: string, registration: string) {
		await this.validateUserVehicule(user, registration);
		await this.findOneByRegistration(registration);
		const where: FindOptionsWhere<Vehicule> = { registration: registration };
		try {
			return await this.vehiculeRepository.delete(where);
		} catch (error) {
			this.commonService.handleException(error, this.logger);
		}
	}

	async validateUserVehicule(user: string, registration: string) {
		if (await this.vehiculeRepository.exist({ where: { registration: registration, user: { userName: user } } })) {
			return true;
		} else {
			throw new NotFoundException(`El usuario: ${user}, no tiene el vehiculo: ${registration}`);
		}
	}
}
