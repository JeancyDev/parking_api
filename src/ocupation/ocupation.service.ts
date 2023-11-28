import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateOcupationDto } from './dto/create-ocupation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ocupation } from './entities/ocupation.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { v4 as uuidV4, validate } from 'uuid';
import { CommonService } from 'src/common/common.service';
import { PlainOcupation } from './entities/ocupation.plain';

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
      vehicule: createOcupationDto.vehicule,
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
    return await this.ocupationRepository.find({ relations: { reservation: true, place: true, vehicule: { user: true, reservations: true } } })
  }

  async findAllPlain() {
    return (await this.findAll()).map((ocupation) => {
      return this.plainOcupationDB(ocupation);
    })
  }

  plainOcupationDB(ocupation: Ocupation): PlainOcupation {
    return {
      placeName: ocupation.place.name,
      vehiculeRegistration: ocupation.vehicule.registration,
      userName: ocupation.vehicule.user.userName,
      startDate: new Date(`${ocupation.startDate} ${ocupation.startTime}`)
    };
  }

  plainOcupation(ocupation: Ocupation): PlainOcupation {
    return {
      placeName: ocupation.place.name,
      vehiculeRegistration: ocupation.vehicule.registration,
      userName: ocupation.vehicule.user.userName,
      startDate: new Date(ocupation.startDate)
    }
  }

  async findOne(term: string) {
    const relations: FindOptionsRelations<Ocupation> = {
      reservation: true,
      place: true,
      vehicule: { user: true }
    }
    if (validate(term)) {
      if (await this.ocupationRepository.exist({
        where: { id: term }
      })) {
        return await this.ocupationRepository.findOne({
          where: { id: term },
          relations: relations
        });
      }
      throw new BadRequestException(`No existe una plaza ocupada con el id: ${term}`);
    }
    if (await this.ocupationRepository.exist({
      where: {
        place: { name: term }
      }, relations: { place: true }
    })) {
      return await this.ocupationRepository.findOne({
        where: { place: { name: term } },
        relations: relations
      })
    }
    if (await this.ocupationRepository.exist({
      where: {
        vehicule: { registration: term }
      }, relations: { vehicule: true }
    })) {
      return await this.ocupationRepository.findOne({
        where: {
          vehicule: { registration: term }
        }, relations: relations
      })
    }
    throw new BadRequestException(`No se encontró ninguna plaza ocupada para el criterio de busqueda: ${term}`);
  }

  async findOnePlain(term: string) {
    const ocupation = await this.findOne(term);
    return this.plainOcupationDB(ocupation);
  }

  async remove(term: string) {
    const ocupation = await this.findOne(term);
    const where: FindOptionsWhere<Ocupation> = { id: ocupation.id };
    await this.ocupationRepository.delete(where);
    return this.plainOcupationDB(ocupation);
  }
}
