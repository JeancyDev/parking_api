import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { v4 as uuidV4 } from 'uuid';
import { Repository } from 'typeorm';
import { Place } from './entities/place.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlaceService {

  private readonly logger: Logger = new Logger(PlaceService.name);

  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>
  ) { }


  async create(createPlaceDto: CreatePlaceDto) {
    try {
      const newPlace = this.placeRepository.create({ id: uuidV4(), ...createPlaceDto });
      const result = await this.placeRepository.insert(newPlace);
      return newPlace;
    }
    catch (error) {
      if (error.code === '23505') {
        const message: string = `Error de llave repetida: ${error.detail}`;
        this.logger.error(message);
        throw new BadRequestException(message);
      }
      else {
        console.log({ error });
      }
    }
  }

  findAll() {
    return `This action returns all place`;
  }

  findOne(id: number) {
    return `This action returns a #${id} place`;
  }

  update(id: number, updatePlaceDto: UpdatePlaceDto) {
    return `This action updates a #${id} place`;
  }

  remove(id: number) {
    return `This action removes a #${id} place`;
  }
}
