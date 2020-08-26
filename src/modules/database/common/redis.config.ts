import { Constants } from 'src/constants/constants';

export default [
  {
    name: Constants.REDIS_CLIENT_PUBLISHER,
    url: Constants.REDIS_URL,
  },
  {
    name: Constants.REDIS_CLIENT_SUBSCRIBER,
    url: Constants.REDIS_URL,
  },
  {
    name: Constants.REDIS_REPOSITORY_CLIENT_NAME,
    url: Constants.REDIS_URL,
  },
];
