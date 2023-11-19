import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CommonService {

    handleException(error: any, logger: Logger): void {
        if (error.code === '23505') {
            const message: string = `Error de llave repetida: ${error.detail}`;
            logger.error(message);
            throw new BadRequestException(message);
        }
        else {
            console.log({ error });
        }
    }
}
