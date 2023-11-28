import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { v4 as uuidV4, validate } from 'uuid';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Place } from './entities/place.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { PlainPlace } from './entities/place.plain';
import { SimpleDateDto, getDateAfterTime, isDateBetween } from 'src/common/utils/date-manage';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Injectable()
export class PlaceService {

  private readonly logger: Logger = new Logger(PlaceService.name);

  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    private readonly commonService: CommonService
  ) { }

  async removeAll() {
    await this.placeRepository.delete({});
  }

  async create(createPlaceDto: CreatePlaceDto) {
    try {
      const newPlace = this.placeRepository.create({ id: uuidV4(), ...createPlaceDto });
      await this.placeRepository.insert(newPlace);
      return this.plainPlace(newPlace);
    }
    catch (error) {
      this.commonService.handleException(error, this.logger);
    }
  }

  async findAll() {
    return await this.placeRepository.find({ relations: { reservations: { vehicule: { user: true } } } });
  }

  async findAllPlain() {
    return (await this.findAll()).map((place) => {
      return this.plainPlace(place);
    })
  }

  async findOne(term: string) {
    let whereOption: FindOptionsWhere<Place> = {};
    if (validate(term)) {
      whereOption = { id: term };
    } else {
      whereOption = { name: term };
    }
    const place = await this.placeRepository.findOne({ where: whereOption, relations: { reservations: { vehicule: { user: true } } } })
    if (!place) {
      throw new BadRequestException(`No existe la plaza ${term}`);
    }
    return place;
  }

  async findOnePlain(term: string) {
    return this.plainPlace(await this.findOne(term));
  }

  plainPlace(place: Place): PlainPlace {
    return {
      name: place.name
    };
  }

  async update(term: string, updatePlaceDto: UpdatePlaceDto) {
    const { id } = await this.findOne(term);
    try {
      const place = await this.placeRepository.preload({ id: id, ...updatePlaceDto });
      await this.placeRepository.update({ id: id }, place);
      return this.plainPlace(place);
    } catch (error) {
      this.commonService.handleException(error, this.logger);
    }
  }

  async remove(id: string) {
    const place = await this.findOne(id);
    try {
      await this.placeRepository.delete({ id: place.id });
    }
    catch (error) {
      this.commonService.handleException(error, this.logger);
    }
    return this.plainPlace(place);
  }

  async findPlaceFree(start: Date, end: Date) {
    const placeAll = await this.findAll();
    if (placeAll.some(
      (place) => {
        return place.reservations.every(
          (reservation) => {
            return this.isPlaceFreeInRange(reservation, start, end);
          })
      })) {
      return placeAll.find(
        (place) => {
          return place.reservations.every(
            (reservation) => {
              return this.isPlaceFreeInRange(reservation, start, end);
            })
        });
    }
    else {
      throw new BadRequestException(`No existe una plaza disponible en el periodo solicitado`);
    }
  }

  isPlaceFreeInRange(reservation: Reservation, startDate: Date, endDate: Date): boolean {
    const start: Date = new Date(`${reservation.startDate} ${reservation.startTime}`);
    const end: Date = getDateAfterTime(start, reservation.time);

    if (isDateBetween(start, end, startDate)) { return false; }
    if (isDateBetween(start, end, endDate)) { return false; }
    if (isDateBetween(startDate, endDate, start)) { return false; }
    if (isDateBetween(startDate, endDate, end)) { return false; }
    return true;
  }

}
