import { Query, Resolver } from '@nestjs/graphql';

//will return Pesrson
@Resolver()
export class UsersResolver {
  //
  @Query(() => String)
  async sayHello() {
    return 'Hello World!';
  }
}
