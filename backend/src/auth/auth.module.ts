import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { Module } from '@nestjs/common';
import { JwtStrategy } from "./jwt.strategy";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";

@Module({
    imports: [
        UsersModule,
        JwtModule.register({}) // GEANI --> NOTE: secret y expires se configuran en AuthService
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})

export class AuthModule {}