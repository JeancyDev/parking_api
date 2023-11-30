import { Reflector } from "@nestjs/core";
import { Rol } from "src/user/entities/user.rol";

export const ROLES_KEY = 'roles';

export const AuhtUserRol = Reflector.createDecorator<Rol[]>();