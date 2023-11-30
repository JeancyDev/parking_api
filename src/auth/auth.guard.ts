import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtSecret } from './auth.module';
import { Observable } from 'rxjs';
import { Payload } from './dto/payload';
import { Reflector } from '@nestjs/core';
import { Rol } from 'src/user/entities/user.rol';
import { AuhtUserRol } from './auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const requiredRoles = this.reflector.get<Rol[]>(AuhtUserRol, context.getHandler());
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (token) {
      try {
        const payload: Payload = this.jwtService.verify(token, {
          secret: JwtSecret
        });
        request['user'] = payload;
        if (requiredRoles.includes(payload.rol)) {
          return true;
        }
        else {
          throw new UnauthorizedException(`No tiene los permisos necesarios`);
        }
      }
      catch (error) {
        throw new UnauthorizedException();
      }
    }
    else {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
