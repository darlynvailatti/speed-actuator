import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { RedisDatabase } from './redis.database';
import { SensorRepositoryService } from './sensor-respository.service';
import { TestRepositoryService } from './test-repository.service';
import { ConfigService } from '@nestjs/config';
import { redisOptionsFactory } from './redis-options.factory';

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: redisOptionsFactory,
    }),
  ],
  providers: [RedisDatabase, SensorRepositoryService, TestRepositoryService],
  exports: [RedisDatabase, SensorRepositoryService, TestRepositoryService],
})
export class DatabaseModule {}
