import { ConfigService } from '@nestjs/config';
import { RedisConstants } from 'src/constants/constants';

export const redisOptionsFactory = (configService: ConfigService) => {
  const redisUrl = configService.get(RedisConstants.REDIS_URL);
  const redisClientPublisherName = configService.get(
    RedisConstants.REDIS_CLIENT_PUBLISHER,
  );
  const redisClientSubscriberName = configService.get(
    RedisConstants.REDIS_CLIENT_SUBSCRIBER,
  );
  const redisClientRepositortyClientName = configService.get(
    RedisConstants.REDIS_REPOSITORY_CLIENT_NAME,
  );

  const options = [
    {
      name: redisClientPublisherName,
      url: redisUrl,
    },
    {
      name: redisClientSubscriberName,
      url: redisUrl,
    },
    {
      name: redisClientRepositortyClientName,
      url: redisUrl,
    },
  ];

  console.log(`Redis Options: ${options}`);
  return options;
};
