import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { TypeOrmConfiguration } from './config/database/type-orm-configuration';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AnimalModule } from './animal/animal.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRootAsync(TypeOrmConfiguration.config),
    AuthModule,
    AnimalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
