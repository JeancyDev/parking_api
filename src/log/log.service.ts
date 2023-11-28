import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Log } from './entities/log.entity';
import { Model } from 'mongoose';
import { PlainLog } from './entities/log.plain';

@Injectable()
export class LogService {

  constructor(
    @InjectModel(Log.name)
    private readonly logModel: Model<Log>) { }

  create(createLogDto: CreateLogDto) {
    const log: Log = {
      userName: createLogDto.userName,
      reservationId: createLogDto.reservationId,
      date: new Date(),
      type: createLogDto.type
    };
    const createLog = new this.logModel(log);
    return createLog.save();
  }

  async findAll() {
    const logs = await this.logModel.find().exec();
    return logs.map((log): PlainLog => {
      return {
        type: log.type,
        userName: log.userName,
        reservationId: log.reservationId,
        date: log.date
      };
    });
  }
}
