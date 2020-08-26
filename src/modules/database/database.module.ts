import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { RedisDatabase } from './redis.database';
import { SensorRepositoryService } from './sensor-respository.service';
import redisConfig from 'src/modules/database/common/redis.config';
import { TestRepositoryService } from './test-repository.service';

@Module({
  imports: [RedisModule.register(redisConfig)],
  providers: [RedisDatabase, SensorRepositoryService, TestRepositoryService],
  exports: [RedisDatabase, SensorRepositoryService, TestRepositoryService],
})
export class DatabaseModule {}
