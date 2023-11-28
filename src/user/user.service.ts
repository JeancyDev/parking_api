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

	async findOne(term: string) {
		if (validate(term)) {
			if (await this.userRepository.exist({ where: { id: term } }))
				return await this.userRepository.findOne({ where: { id: term } })
			else
				throw new BadRequestException(`No existe el usuario con el id ${term}`);
		}
		else {
			if (await this.userRepository.exist({ where: { userName: term } }))
				return await this.userRepository.findOne({ where: { userName: term } })
			else
				throw new BadRequestException(`No existe el usuario con el usuario ${term}`);
		}
	}

	async update(term: string, updateUserDto: UpdateUserDto) {
		const { id } = await this.findOne(term);
		try {
			const user: User = await this.userRepository.preload({
				id: id,
				...updateUserDto
			});
			if (updateUserDto.password) {
				user.password = bcrypt.hashSync(user.password, 10);
			}
			const optionWhere: FindOptionsWhere<User> = { id: user.id };
			await this.userRepository.update(optionWhere, user);
			return this.plainUser(user);
		} catch (error) {
			this.commonService.handleException(error, this.logger);
		}
	}

	async remove(term: string) {
		const user = await this.findOne(term);
		const plain = this.plainUser(user);
		try {
			await this.userRepository.remove(user)
		} catch (error) {
			this.commonService.handleException(error, this.logger);
		}
		return plain;
	}
}
