export enum Constants{

    MONGO_URL = "mongodb://localhost/",
    MONGO_DB = "speed",

    REDIS_URL = "localhost:6379",
    REDIS_CLIENT_PUBLISHER  = "redis-pub",
    REDIS_CLIENT_SUBSCRIBER  = "redis-sub",
    
    SENSOR_DETECTION_BROKER_CHANNEL  = "SENSOR_DETECTION",
    TEST_UPDATE_STATE_CHANNEL = "TEST_UPDATE_STATE",

    TEST_VIEW_CHANNEL_WS = "TEST_VIEW_CHANNEL_WS"


}

export enum ConstantsApiTags {
    VIEW_API_TAG = "view",
    EXECUTION_API_TAG = "execution",
    DETECTION_API_TAG = "detection",
    LAB_API_TAG = "laboratory"
}