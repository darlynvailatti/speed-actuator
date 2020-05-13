import * as mongoose from 'mongoose';

export const SensorSchema = new mongoose.Schema({
  code: String,
  description: String,
});

module.exports = mongoose.model('sensor', SensorSchema);