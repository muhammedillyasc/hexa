import * as mongoose from 'mongoose';

export const StoreSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      index: true,
      required: true,
      auto: true,
    },
    country: {
      type: String,
      required: true,
    },
    storeCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
