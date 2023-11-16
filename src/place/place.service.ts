import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { v4 as uuidV4, validate } from 'uuid';
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
      await this.placeRepository.insert(newPlace);
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

  async findAll() {
    try {
      return (await this.placeRepository.findBy({}));
    }
    catch (error) {
      console.log({ error })
    }
  }

  async findOne(term: string) {
    if (validate(term)) {
      const place = await this.placeRepository.findOne({ where: { id: term } })
      if (!place) {
        throw new BadRequestException(`No existe una plaza con el id: ${term}`);
      }
      return place;
    } else {
      const place = await this.placeRepository.findOne({ where: { name: term } })
      if (!place) {
        throw new BadRequestException(`No existe una plaza con el nombre: ${term}`);
      }
      return place;
    }
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto) {
    const place = await this.findOne(id);
    if (updatePlaceDto.name) {
      const place = await this.placeRepository.preload({ id: id, ...updatePlaceDto });
      const updatedPlace = await this.placeRepository.save(place);
      return updatedPlace;
    }
    else {
      return place;
    }
  }

  async remove(id: string) {
    const place = await this.findOne(id);
    return await this.placeRepository.remove(place);
  }
}
