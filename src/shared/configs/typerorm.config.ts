import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  username: config.getOrThrow<string>('DATABASE_USER'),
  password: config.getOrThrow<string>('DATABASE_PASSWORD'),
  host: config.getOrThrow<string>('DATABASE_HOST'),
  port: config.getOrThrow<number>('DATABASE_PORT'),
  database: config.getOrThrow<string>('DATABASE_NAME'),
  autoLoadEntities: true,
  synchronize: true,
});
