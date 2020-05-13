import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { RedisDatabase } from './redis.service';
import { MongooseModule } from '@nestjs/mongoose'
import { SensorRepositoryService } from './sensor-respository.service'
import { TestTemplateRepository } from './test-template-repository.service';
import mongoConfig from 'src/modules/database/common/mongo.config'
import redisConfig from 'src/modules/database/common/redis.config'
import { SequenceGeneratorService } from './sequence-generator.service';
import { TestRepositoryService } from './test-repository.service';

@Module({
  imports: [
    MongooseModule.forRoot(mongoConfig.url, { useNewUrlParser: true, useUnifiedTopology: true}),
    MongooseModule.forFeature(mongoConfig.schemas),
    RedisModule.register(redisConfig),
  ],
  providers: [
    SequenceGeneratorService,
    RedisDatabase, 
    SensorRepositoryService, 
    TestTemplateRepository,
    TestRepositoryService
  ],
  exports: [
    SequenceGeneratorService,
    RedisDatabase, 
    SensorRepositoryService, 
    TestTemplateRepository,
    TestRepositoryService
    
  ],

})
export class DatabaseModule {
  
}