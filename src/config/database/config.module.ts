import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { PostgresqlConfigService } from './configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [PostgresqlConfigService, ConfigService],
  exports: [PostgresqlConfigService, ConfigService],
})
export class PostgresqlConfigModule {}
