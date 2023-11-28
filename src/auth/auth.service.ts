import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SigInDto } from './dto/sigIn.dto';
import { compare, compareSync, } from 'bcrypt';
import { privateDecrypt } from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService) { }

    async signIn(sigInDto: SigInDto) {
        try {
            const { id, userName, password, rol } = await this.userService.findOne(sigInDto.userName);
            if (await compare(sigInDto.password, password)) {
                const payload = { sub: id, userName: userName, rol: rol };
                return {
                    acces_token: await this.jwtService.signAsync(payload)
                }
            } else {
                throw new UnauthorizedException();
            }
        } catch (error) {
            throw new UnauthorizedException(`Usuario o Contraseña Incorrectos`);
        }
    }
}
