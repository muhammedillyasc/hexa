import { Injectable } from '@nestjs/common';
import { Store } from './dto/users.dto';
import { CreateStoreInput } from './dto/inputs/create-store.input';
import { StoreSchemaName } from './schemas/store.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Injectable() // we can use this othjer places
export class UsersService {
  constructor(
    @InjectModel(StoreSchemaName)
    private readonly storeModel: Model<Store>,
  ) {}

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
