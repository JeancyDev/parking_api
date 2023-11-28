import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { TypeLog } from "./type.log";
import { HydratedDocument } from "mongoose";

export type LogDocument = HydratedDocument<Log>;

@Schema()
export class Log {

    @Prop({ enum: TypeLog })
    type: TypeLog;

    @Prop({ type: String })
    userName: string;

    @Prop({ type: Number })
    reservationId: number;

    @Prop({ type: String })
    date: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);