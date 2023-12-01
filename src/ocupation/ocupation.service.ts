import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateOcupationDto } from './dto/create-ocupation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ocupation } from './entities/ocupation.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { v4 as uuidV4, validate } from 'uuid';
import { CommonService } from 'src/common/common.service';
import { PlainOcupation } from './entities/ocupation.plain';
import { FindOcupationDto } from './dto/find-ocupation.dto';
import { PlaceService } from 'src/place/place.service';

@Injectable()
export class OcupationService {

  private readonly logger: Logger = new Logger(OcupationService.name);

  constructor(
    @InjectRepository(Ocupation)
    private readonly ocupationRepository: Repository<Ocupation>,
    private readonly commonService: CommonService,
    private readonly placeService: PlaceService
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

  async findOne(place: string) {
    const relations: FindOptionsRelations<Ocupation> = {
      reservation: { vehicule: { user: true } },
      place: true,
    }
    await this.placeService.findOne(place);
    if (await this.ocupationRepository.exist({ where: { place: { name: place } } })) {
      return await this.ocupationRepository.findOne({
        where: { place: { name: place } },
        relations: relations
      });
    } else {
      this.logger.error(`La plaza ${place} no está ocupada`)
      throw new NotFoundException(`La plaza ${place} no está ocupada`);
    }
  }

  async findOnePlain(place: string) {
    const ocupation = await this.findOne(place);
    return this.plainOcupationDB(ocupation);
  }

  async remove(place: string) {
    const ocupation = await this.findOne(place);
    const where: FindOptionsWhere<Ocupation> = { id: ocupation.id };
    try {
      await this.ocupationRepository.delete(where);
    } catch (error) {
      this.commonService.handleException(error, this.logger);
    }
    return this.plainOcupationDB(ocupation);
  }
}
