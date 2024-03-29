import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Store, UserResponse } from './dto/users.dto';
import { CreateStoreInput } from './dto/inputs/create-store.input';
import { StoreSchemaName } from './schemas/store.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { CreateUserInput } from './dto/inputs/create-user.input';
import { AuthSchemaName } from './schemas/auth.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInput } from './dto/inputs/login-user.input';
import { USER_ACCOUNT_STATUS } from './enum/accountStatus.enum';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { USER_ROLES } from './enum/role.enum';
import { UpdateStoreInput } from './dto/inputs/update-store.input';
import { ResetPasswordInput } from './dto/inputs/reset-password.input';
import { ForgotPasswordInput } from './dto/inputs/forgot-password.input';

@Injectable() // we can use this othjer places
export class UsersService {
  constructor(
    @InjectModel(StoreSchemaName)
    private readonly storeModel: Model<Store>,
    @InjectModel(AuthSchemaName)
    private readonly authModel: Model<UserResponse>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   *
   * @param admin
   * @returns
   */
  async generateUserToken(user: UserResponse): Promise<string> {
    // jwt payload
    const payload = {
      email: user.email,
      role: user.role,
      category: user?.category || null,
      isActive: user.isActive,
    };
    return this.jwtService.signAsync(payload);
  }

  /**
   *
   * @param password
   * @returns
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Number of salt rounds
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  /**
   * Check password is valid
   * @param password
   * @param hashedPassword
   * @returns
   */
  async isValidPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      const result = await bcrypt.compare(password, hashedPassword);
      return result;
    } catch (error) {
      return false;
    }
  }

  //auth
  async createUser(input: CreateUserInput): Promise<any> {
    const userExist = await this.authModel.findOne({ email: input.email });

    if (userExist?.email) {
      throw new BadRequestException(
        'Requested email already exist on another account...',
      );
    }

    const data = {
      _id: uuid(),
      email: input.email,
      password: await this.hashPassword(input.password),
      firstName: input.firstName,
      lastName: input.lastName,
    };

    const newUser = await this.authModel.create({ ...data });

    if (!newUser?._id) {
      throw new InternalServerErrorException(
        'Something went wrong while create admin account...',
      );
    }

    return newUser.toJSON();
  }

  async loginUser(input: LoginUserInput): Promise<UserResponse> {
    const userExist = await this.authModel.findOne({ email: input.email });

    if (!userExist?.email) {
      throw new NotFoundException(
        'We coudnt find any account in this email...',
      );
    }

    if (Number(userExist?.isActive) !== USER_ACCOUNT_STATUS.ACTIVE) {
      throw new UnauthorizedException('User account is not activated yet...');
    }

    const isPasswordMatch = await this.isValidPassword(
      input.password,
      userExist.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Email and Password are not matching...');
    }
    return userExist;
  }

  /**
   *
   * @returns
   */
  async updateUser(input: UpdateUserInput): Promise<UserResponse> {
    const { email, ...rest } = input || {};
    const userExist = await this.authModel
      .findOneAndUpdate(
        { email: email },
        {
          $set: {
            ...rest,
          },
        },
      )
      .lean();
    if (!userExist?.email) {
      throw new BadRequestException('Requested email not exist...');
    }

    return userExist;
  }

  /**
   * delete user account
   * @param email
   */
  async deleteUserAccount(email: string): Promise<boolean> {
    try {
      const result = await this.authModel.findByIdAndDelete({
        email,
        role: { $ne: USER_ROLES.SUPER_ADMIN },
      });

      return !!result?._id;
    } catch (e) {
      return false;
    }
  }

  async resetPassword(input: ResetPasswordInput): Promise<boolean> {
    try {
      console.log(input);
      return true;
    } catch (e) {
      return false;
    }
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<boolean> {
    // return true or false trigger the email or otp here tor reset
    try {
      console.log(input);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   *
   * @param password
   * @returns
   */
  async getUserByEmail(email: string): Promise<UserResponse> {
    const userExist = await this.authModel.findOne({ email });

    if (!userExist?.email) {
      throw new NotFoundException(
        'We coudnt find any account in this email...',
      );
    }
    return userExist;
  }

  /**
   *
   * @returns users list
   */
  async getUsers(): Promise<UserResponse[]> {
    const users = await this.authModel.find({});
    return users;
  }

  ///////////////////////////////////////////////////////////
  //STORE

  /**
   *
   * @returns store list
   */
  async getStores(): Promise<Store[]> {
    const stores = await this.storeModel.find({});
    return stores;
  }

  /**
   *
   * @param createStoreData
   * @returns
   */
  async createStore(createStoreData: CreateStoreInput): Promise<Store> {
    const storeExist = await this.storeModel.findOne({
      storeCode: createStoreData.storeCode,
    });

    if (storeExist) {
      return;
    }
    const data = {
      _id: uuid(),
      country: createStoreData?.country,
      storeCode: createStoreData?.storeCode,
    };
    const store: Store = data;
    const newStore = await this.storeModel.create({ ...store });
    return newStore.toJSON();
  }

  /**
   *
   * @param createStoreData
   * @returns
   */
  async updateStore(updateStoreData: UpdateStoreInput): Promise<Store> {
    // need updation
    const storeExist = await this.storeModel.findOne({
      storeCode: updateStoreData.storeCode,
    });

    if (storeExist) {
      return;
    }
    const data = {
      _id: uuid(),
      country: updateStoreData?.country,
      storeCode: updateStoreData?.storeCode,
    };
    const store: Store = data;
    const newStore = await this.storeModel.create({ ...store });
    return newStore.toJSON();
  }

  async deleteStore(storeCode: string): Promise<boolean> {
    try {
      const result = await this.storeModel.deleteOne({ storeCode });
      return !!result?.acknowledged;
    } catch (e) {
      return false;
    }
  }
}
