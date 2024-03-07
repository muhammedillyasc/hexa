import * as mongoose from 'mongoose';

export const AuthSchema = new mongoose.Schema(
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
