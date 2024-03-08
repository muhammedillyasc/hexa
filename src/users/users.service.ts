import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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

@Injectable() // we can use this othjer places
export class UsersService {
  constructor(
    @InjectModel(StoreSchemaName)
    private readonly storeModel: Model<Store>,
    @InjectModel(AuthSchemaName)
    private readonly authModel: Model<UserResponse>,
    // private readonly jwtService: JwtService,
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
    return 'sdahs`dfcv';
    //return this.jwtService.signAsync(payload);
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

  async getStores(): Promise<Store[]> {
    const stores = await this.storeModel.find({});
    return stores;
  }

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

  public updatStore() {}

  public deleteStore() {}
}
