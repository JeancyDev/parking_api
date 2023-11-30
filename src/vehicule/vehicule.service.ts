import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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

	async removeAll() {
		await this.vehiculeRepository.delete({});
	}

	async create(findOption: FindVehiculeDto, createVehiculeDto: CreateVehiculeDto) {
		const { ...vehiculeDetails } = createVehiculeDto;
		const user = await this.userService.findOne(findOption.userName);
		const vehicule = this.vehiculeRepository.create({ user: user, id: uuidV4(), ...vehiculeDetails, reservations: [] });
		try {
			await this.vehiculeRepository.insert(vehicule);
		} catch (error) {
			this.commonService.handleException(error, this.logger);
		}
		return await this.plainVehicule(vehicule);
	}

	private findOptionWhere(findOption: FindVehiculeDto): FindOptionsWhere<Vehicule> {
		return {
			id: findOption.id,
			registration: findOption.registration,
			user: { userName: findOption.userName }
		}
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

	async findOnePlain(findOption: FindVehiculeDto) {
		return this.plainVehicule(
			await this.findOne(findOption)
		);
	}

	async plainVehicule(vehicule: Vehicule) {
		const plain: PlainVehicule = {
			brand: vehicule.brand,
			model: vehicule.model,
			registration: vehicule.registration,
			owner: this.userService.plainUser(vehicule.user)
		}
		return plain;
	}

	async findOne(findOption: FindVehiculeDto) {
		let whereOption: FindOptionsWhere<Vehicule> = this.findOptionWhere(findOption);
		if (await this.vehiculeRepository.exist({ where: whereOption })) {
			return await this.vehiculeRepository.findOne({ where: whereOption, relations: { user: true } });
		} else {
			this.logger.error(`No existe el vehiculo`);
			throw new BadRequestException(`No existe el vehiculo`);
		}
	}

	async update(findOption: FindVehiculeDto, updateVehiculeDto: UpdateVehiculeDto) {
		const vehicule = await this.findOne(findOption);
		const { owner, ...updateProps } = updateVehiculeDto;
		try {
			const updatedVehicule = await this.vehiculeRepository.preload({ id: vehicule.id, ...updateProps });
			const { id } = await this.vehiculeRepository.save(updatedVehicule);
			return await this.findOnePlain({ id: id });
		} catch (error) {
			this.commonService.handleException(error, this.logger);
		}
	}

	async remove(findOption: FindVehiculeDto) {
		const vehicule = await this.findOne(findOption);
		await this.vehiculeRepository.remove(vehicule);
		return await this.plainVehicule(vehicule);
	}
}
