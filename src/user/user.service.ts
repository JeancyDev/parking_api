import { BadRequestException, HttpCode, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidV4, validate } from 'uuid';
import * as bcrypt from 'bcrypt';
import { FindOptionsWhere, Repository } from 'typeorm';
import { VehiculeService } from 'src/vehicule/vehicule.service';

@Injectable()
export class UserService {

	private readonly logger: Logger = new Logger(UserService.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>) { }

	private handleException(error: any): void {
		if (error.code === '23505') {
			if (error.detail.includes('userName')) {
				this.logger.error(`Error de llave repetida este usuario ya existe`);
				throw new BadRequestException(`Error de llave repetida este usuario ya existe`);
			}
			if (error.detail.includes('email')) {
				this.logger.error(`Error de llave repetida este email ya existe`);
				throw new BadRequestException(`Error de llave repetida este email ya existe`);
			}
		} else {
			console.log({ error });
		}
	}

	async create(createUserDto: CreateUserDto) {
		try {
			const { password, ...properties } = createUserDto;
			const user = { id: uuidV4(), password: bcrypt.hashSync(password, 10), ...properties };
			const newUser = this.userRepository.create(user);
			return await this.userRepository.save(newUser);
		} catch (error) {
			this.handleException(error);
		}
	}

	async findAll() {
		return await this.userRepository.find({
			select: {
				fullName: true,
				rol: true,
				userName: true,
				vehicules: {
					mark: true,
					model: true,
					registration: true
				}
			}, relations: { vehicules: true }
		});
	}

	async findOnePlain(term: string) {
		return await this.plainUser(await this.findOne(term));

	}

	async plainUser(user: User) {
		const { id, password, ...userProperties } = user;
		const vehicules = userProperties.vehicules.map(
			(vehicule) => {
				const { id, owner, ...props } = vehicule;
				return props;
			});
		return { ...userProperties, vehicules };
	}

	async findOne(term: string) {
		let whereOption: FindOptionsWhere<User> = {};
		if (validate(term)) {
			whereOption = { id: term };
		}
		else {
			whereOption = { userName: term };
		}
		if (await this.userRepository.exist({ where: whereOption })) {
			return await this.userRepository.findOne({
				where: whereOption,
				relations: { vehicules: true }
			});
		}
		else {
			throw new BadRequestException(`No existe un usuario ${term}`);
		}
	}

	async update(term: string, updateUserDto: UpdateUserDto) {
		const { id, vehicules } = await this.findOne(term);
		try {
			const user = await this.userRepository.preload({ id: id, ...updateUserDto });
			if (updateUserDto.password) {
				user.password = bcrypt.hashSync(user.password, 10);
			}
			const { fullName, userName, rol } = await this.userRepository.save(user);
			return {
				fullName, userName, rol, vehicules: vehicules.map(
					(vehicule) => {
						const { id, owner, ...props } = vehicule;
						return props;
					})
			};
		} catch (error) {
			this.handleException(error);
		}
	}

	async remove(term: string) {
		const user = await this.findOne(term);
		const plain = await this.plainUser(user);
		try {
			await this.userRepository.remove(user)
		} catch (error) {
			console.log({ error });
		}
		return plain;
	}
}
