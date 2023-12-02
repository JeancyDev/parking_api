import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SigInDto } from './dto/sigIn.dto';
import { compare, } from 'bcrypt';
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
                return await this.jwtService.signAsync(payload)
            } else {
                throw new BadRequestException(`Usuario o Contraseña Incorrectos`);
            }
        } catch (error) {
            throw new BadRequestException(`Usuario o Contraseña Incorrectos`);
        }
    }
}
