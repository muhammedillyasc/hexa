import { Injectable } from '@nestjs/common';
import { Store } from './dto/users.dto';
import { CreateStoreInput } from './dto/inputs/create-store.input';

@Injectable() // we can use this othjer places
export class UsersService {
  private persons: Store[] = [
    {
      _id: '1',
      country: '',
      storeCode: 23,
    },
  ];

  public getStores(): Store[] {
    return [];
  }

  public createStore(createStoreData: CreateStoreInput): Store {
    const store: Store = {
      _id: '2',
      ...createStoreData,
    };
    this.persons.push(store);
    return store;
  }

  public updatStore() {}

  public deleteStore() {}
}
