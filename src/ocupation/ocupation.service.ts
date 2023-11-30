import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateOcupationDto } from './dto/create-ocupation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ocupation } from './entities/ocupation.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { v4 as uuidV4, validate } from 'uuid';
import { CommonService } from 'src/common/common.service';
import { PlainOcupation } from './entities/ocupation.plain';
import { FindOcupationDto } from './dto/find-ocupation.dto';

@Injectable()
export class OcupationService {

  private readonly logger: Logger = new Logger(OcupationService.name);

  constructor(
    @InjectRepository(Ocupation)
    private readonly ocupationRepository: Repository<Ocupation>,
    private readonly commonService: CommonService
  ) { }

  async create(createOcupationDto: CreateOcupationDto) {
    const ocupation = this.ocupationRepository.create({
      id: uuidV4(),
      place: createOcupationDto.place,
      startDate: createOcupationDto.dateTime,
      startTime: createOcupationDto.dateTime,
      reservation: createOcupationDto.reservation
    });

    try {
      await this.ocupationRepository.insert(ocupation);
      return ocupation;
    } catch (error) {
      this.commonService.handleException(error, this.logger);
    }
  }

  async findAll() {
    return await this.ocupationRepository.find({ relations: { place: true, reservation: { vehicule: { user: true } } } });
  }

  async findAllPlain() {
    return (await this.findAll()).map((ocupation) => {
      return this.plainOcupationDB(ocupation);
    })
  }

  plainOcupationDB(ocupation: Ocupation): PlainOcupation {
    return {
      placeName: ocupation.place.name,
      vehiculeRegistration: ocupation.reservation.vehicule.registration,
      userName: ocupation.reservation.vehicule.user.userName,
      startDate: new Date(`${ocupation.startDate} ${ocupation.startTime}`),
      time: ocupation.reservation.time
    };
  }

  plainOcupation(ocupation: Ocupation): PlainOcupation {
    return {
      placeName: ocupation.place.name,
      vehiculeRegistration: ocupation.reservation.vehicule.registration,
      userName: ocupation.reservation.vehicule.user.userName,
      startDate: new Date(ocupation.startDate),
      time: ocupation.reservation.time
    }
  }

  async findOne(findOption: FindOcupationDto) {
    const relations: FindOptionsRelations<Ocupation> = {
      reservation: { vehicule: { user: true } },
      place: true,
    }

    let whereOption: FindOptionsWhere<Ocupation> = {
      reservation: { publicId: findOption.reservationId, vehicule: { registration: findOption.vehiculeRegistration, user: { userName: findOption.userName } } },
      place: { name: findOption.placeName },
    };
    if (await this.ocupationRepository.exist({ where: whereOption })) {
      return await this.ocupationRepository.findOne({
        where: whereOption,
        relations: relations
      });
    }
    this.logger.error(`No se encuentra una plaza ocupada`)
    throw new BadRequestException(`No se encuentra una plaza ocupada`);
  }

  async find(findOption: FindOcupationDto) {
    if (!findOption.placeName && !findOption.reservationId && !findOption.userName && !findOption.vehiculeRegistration) {
      return await this.findAllPlain();
    } else {
      return await this.findOnePlain(findOption);
    }
  }

  async findOnePlain(findOption: FindOcupationDto) {
    const ocupation = await this.findOne(findOption);
    return this.plainOcupationDB(ocupation);
  }

  async remove(findOption: FindOcupationDto) {
    const ocupation = await this.findOne(findOption);
    const where: FindOptionsWhere<Ocupation> = { id: ocupation.id };
    await this.ocupationRepository.delete(where);
    return this.plainOcupationDB(ocupation);
  }
}
