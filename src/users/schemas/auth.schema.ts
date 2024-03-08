import * as mongoose from 'mongoose';
import { USER_ACCOUNT_STATUS } from '../enum/accountStatus.enum';
import { USER_ROLES } from '../enum/role.enum';

export const AuthSchemaName = 'auth';
export const AuthSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      index: true,
      required: true,
      auto: true,
    },
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    role: {
      type: String,
      enum: USER_ROLES,
      default: USER_ROLES.STUDIO_TEAM,
    },
    category: {
      type: String,
      default: '_',
      index: true,
    },
    isActive: {
      type: Number,
      default: USER_ACCOUNT_STATUS.IN_ACTIVE,
      enum: USER_ACCOUNT_STATUS,
    },
  },
  {
    timestamps: true,
  },
);

// import * as mongoose from 'mongoose';
// export const AuthSchemaName = 'auth';
// export const AuthSchema = new mongoose.Schema(
//   {
//     _id: {
//       type: String,
//     },
//     role: {
//       type: String,
//       required: true,
//     },
//     category: {
//       type: String,
//       required: true,
//     },
//     isActive: {
//       type: Number,
//     },
//     email: {
//       type: String,
//       required: true,
//     },
//     firstName: {
//       type: String,
//       required: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );
