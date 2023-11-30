import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { v4 as uuidV4, validate } from 'uuid';
import * as bcrypt from 'bcrypt';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { PlainUser } from './entities/user.plain';
import { Payload } from 'src/auth/dto/payload';

@Injectable()
export class UserService {

	private readonly logger: Logger = new Logger(UserService.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly commonService: CommonService) { }

	async removeAll() {
		await this.userRepository.delete({});
	}
	async create(createUserDto: CreateUserDto) {
		try {
			const { password, ...properties } = createUserDto;
			const user = this.userRepository.create({
				id: uuidV4(),
				password: bcrypt.hashSync(password, 10),
				...properties
			});
			await this.userRepository.insert(user);
			return this.plainUser(user);
		} catch (error) {
			this.commonService.handleException(error, this.logger);
		}
	}

	async findAll() {
		return await this.userRepository.find({
			select: {
				fullName: true,
				rol: true,
				userName: true
			}
		});
	}

	async findOnePlain(term: string): Promise<PlainUser> {
		return this.plainUser(
			await this.findOne(term)
		);

	}

	plainUser(user: User): PlainUser {
		const { id, password, ...userProperties } = user;
		const plainUser: PlainUser = { ...userProperties };
		return plainUser
	}

	async findOne(userName: string) {
		if (await this.userRepository.exist({ where: { userName: userName } }))
			return await this.userRepository.findOne({ where: { userName: userName } })
		else
			throw new BadRequestException(`No existe el usuario: ${userName}`);
	}

	async update(userName: string, updateUserDto: UpdateUserDto) {
		const userOld = await this.findOne(userName);
		try {
			const user: User = await this.userRepository.preload({
				id: userOld.id,
				...updateUserDto
			});
			if (updateUserDto.password) {
				user.password = bcrypt.hashSync(user.password, 10);
			}
			const where: FindOptionsWhere<User> = { id: user.id };
			await this.userRepository.update(where, user);
			return this.plainUser(user);
		} catch (error) {
			this.commonService.handleException(error, this.logger);
		}
	}

	async remove(userName: string) {
		if (await this.userRepository.exist({ where: { userName: userName } })) {
			const where: FindOptionsWhere<User> = { userName: userName };
			try {
				return await this.userRepository.delete(where);
			} catch (error) {
				this.commonService.handleException(error, this.logger);
			}
		}
		else {
			throw new BadRequestException(`No existe el usuario: ${userName}`);
		}
	}
}
