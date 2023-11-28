import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class CommonService {

    handleException(error: any, logger: Logger): void {
        if (error.code === '23505') {
            const message: string = `Error de llave repetida`;
            logger.error(message);
            throw new BadRequestException(message);
        }
        if (error.code === '23503') {
            const message = 'Error de llave foranea no encontrada'
            logger.error(message);
            throw new InternalServerErrorException(message);
        }
        else {
            logger.error(`Ah ocurrido un error inexperado`);
            console.log({ error });
            throw new InternalServerErrorException(`Ah ocurrido un error inexperado consulte los logs`);
        }
    }
}
