import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidV4, validate } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

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
		return await this.userRepository.find({});
	}

	async findOne(term: string) {
		if (validate(term)) {
			const user = await this.userRepository.findOne({ where: { id: term } });
			if (user == null) {
				throw new BadRequestException(`No existe un usuario con el id ${term}`);
			}
			return user;
		}
		else {
			const user = await this.userRepository.findOne({ where: { userName: term } });
			if (user == null) {
				throw new BadRequestException(`No existe el usuario ${term}`);
			}
			return user;
		}
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		await this.findOne(id);
		try {
			const user = await this.userRepository.preload({ id: id, ...updateUserDto });
			if (updateUserDto.password) {
				user.password = bcrypt.hashSync(user.password, 10);
			}
			return await this.userRepository.save(user);
		} catch (error) {
			this.handleException(error);
		}
	}

	async remove(id: string) {
		await this.findOne(id);
		return await this.userRepository.delete({ id: id });
	}
}
