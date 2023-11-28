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

	async create(createVehiculeDto: CreateVehiculeDto) {
		const { owner, ...vehiculeDetails } = createVehiculeDto;
		const user = await this.userService.findOne(owner);
		const vehicule = this.vehiculeRepository.create({ user: user, id: uuidV4(), ...vehiculeDetails, reservations: [] });
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

	async findOnePlain(term: string) {
		return this.plainVehicule(
			await this.findOne(term)
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

	async findOne(term: string) {
		let whereOption: FindOptionsWhere<Vehicule> = {};
		if (validate(term)) {
			whereOption = { id: term };
		}
		else {
			whereOption = { registration: term };
		}
		const vehicule = await this.vehiculeRepository.findOne({ where: whereOption, relations: { user: true } });
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
			this.commonService.handleException(error, this.logger);
		}
	}

	async remove(term: string) {
		const vehicule = await this.findOne(term);
		await this.vehiculeRepository.remove(vehicule);
		return await this.plainVehicule(vehicule);
	}
}
