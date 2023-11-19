import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { v4 as uuidV4, validate } from 'uuid';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Place } from './entities/place.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class PlaceService {

  private readonly logger: Logger = new Logger(PlaceService.name);

  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    private readonly commonService: CommonService
  ) { }


  async create(createPlaceDto: CreatePlaceDto) {
    try {
      const newPlace = this.placeRepository.create({ id: uuidV4(), ...createPlaceDto });
      await this.placeRepository.insert(newPlace);
      return { ...createPlaceDto };
    }
    catch (error) {
      this.commonService.handleException(error, this.logger);
    }
  }

  async findAll() {
    return (await this.placeRepository.find({
      select: {
        name: true
      }
    }));
  }

  async findOne(term: string) {
    let whereOption: FindOptionsWhere<Place> = {};
    if (validate(term)) {
      whereOption = { id: term };
    } else {
      whereOption = { name: term };
    }
    const place = await this.placeRepository.findOne({ where: whereOption })
    if (!place) {
      throw new BadRequestException(`No existe la plaza ${term}`);
    }
    return place;
  }

  async findOnePlain(term: string) {
    return await this.plainPlace(await this.findOne(term));
  }

  async plainPlace(place: Place) {
    const { id, ...props } = place;
    return { ...props };
  }

  async update(term: string, updatePlaceDto: UpdatePlaceDto) {
    const { id } = await this.findOne(term);
    try {
      const place = await this.placeRepository.preload({ id: id, ...updatePlaceDto });
      return await this.plainPlace(await this.placeRepository.save(place));
    } catch (error) {
      this.commonService.handleException(error, this.logger);
    }
  }

  async remove(id: string) {
    const place = await this.findOne(id);
    return await this.placeRepository.remove(place);
  }
}
