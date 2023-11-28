import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigInDto } from './dto/sigIn.dto';
import { ApiTags, ApiBearerAuth, ApiSecurity, ApiHeader, } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() sigIn: SigInDto) {
        return this.authService.signIn(sigIn);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    @ApiBearerAuth()
    @ApiSecurity('basic')
    @ApiHeader({ name: 'acces_token' })
    getProfile(@Request() req) {
        return req.user;
    }

}
