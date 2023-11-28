import { TypeLog } from "../entities/type.log";

export class CreateLogDto {
    type: TypeLog;
    userName: string;
    reservationId: number;
}
