import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Store } from './dto/users.dto';
import { UsersService } from './users.service';
import { CreateStoreInput } from './dto/inputs/create-store.input';

//will return Pesrson
@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [Store])
  async getStores(): Promise<Store[]> {
    return this.usersService.getStores();
  }

  @Mutation(() => Store)
  async createStore(
    @Args('createStoreData') createStoreData: CreateStoreInput,
  ): Promise<Store> {
    return this.usersService.createStore(createStoreData);
  }
}
