import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';

export const JwtSecret: string = `${process.env.SECRET}`;

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: JwtSecret,
      signOptions: { expiresIn: '36000s' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }],
  exports: [AuthService]
})
export class AuthModule { }
