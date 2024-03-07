import * as mongoose from 'mongoose';

export const StoreSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      index: true,
      required: true,
      auto: true,
    },
  },
  {
    timestamps: true,
  },
);
