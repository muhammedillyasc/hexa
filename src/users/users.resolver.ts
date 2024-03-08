import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Store, UserWithTokenResponse } from './dto/users.dto';
import { UsersService } from './users.service';
import { CreateStoreInput } from './dto/inputs/create-store.input';
import { CreateUserInput } from './dto/inputs/create-user.input';
import {
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { LoginUserInput } from './dto/inputs/login-user.input';
import { UpdateUserInput } from './dto/inputs/update-user.input';
import { USER_ROLES } from './enum/role.enum';
import { AuthGuard } from './guard/auth.guard';

//will return Pesrson
@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authGuard: AuthGuard,
  ) {}

  @Mutation(() => UserWithTokenResponse)
  async createUser(@Args('input') createUserInput: CreateUserInput) {
    try {
      // if the password are not matched
      if (createUserInput?.password !== createUserInput?.confirmPassword) {
        throw new NotAcceptableException(
          'Password and Confirm Password are not matching...',
        );
      }

      const user = await this.usersService.createUser(createUserInput);
      if (!user?._id) {
        throw new InternalServerErrorException(
          'Failed to create admin account...',
        );
      }

      const token = await this.usersService.generateUserToken(user);

      // // TRIGGER EMAIL - NEW USER
      // this.usersService.sentAccountCreatedEmail({
      //   ...admin,
      //   password: createAdminInput?.password || '',
      // });

      return {
        token,
        user,
      };
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred.');
      // const exceptionType = exceptionMap[error.constructor.name];
      // if (exceptionType) {
      //   throw new exceptionType(error.message);
      // } else {
      //   throw new InternalServerErrorException('An unexpected error occurred.');
      // }
    }
  }

  /**
   * LOGIN ADMIN ACCOUNT WITH PASSWORD
   * @param createAdminInput
   * @param context
   * @returns
   */

  @Mutation(() => UserWithTokenResponse)
  async loginUser(@Args('input') loginAdminInput: LoginUserInput) {
    try {
      const admin = await this.usersService.loginUser(loginAdminInput);

      if (!admin?.email) {
        throw new NotFoundException('Requested user email not exist');
      }
      const token = await this.usersService.generateUserToken(admin);

      return {
        token,
        admin,
      };
    } catch (error) {
      // const exceptionType = exceptionMap[error.constructor.name];
      // if (exceptionType) {
      //   throw new exceptionType(error.message);
      // } else {
      //   throw new InternalServerErrorException('An unexpected error occurred.');
      // }
    }
  }

  /**
   * UPDATE USER AUTH ACCOUNT
   * @param updateUserInput
   * @param context
   * @returns
   */

  @Mutation(() => UserWithTokenResponse)
  async updateAdmin(
    @Args('input') updateAdminInput: UpdateUserInput,
    @Context() context: any,
  ) {
    try {
      // check user have the access
      await this.authGuard.checkUserAccess(context, [USER_ROLES.SUPER_ADMIN]);
      const admin = await this.usersService.updateAdmin(updateAdminInput);
      const token = await this.usersService.generateUserToken(admin);

      return {
        token,
        admin,
      };
    } catch (error) {
      // const exceptionType = exceptionMap[error.constructor.name];
      // if (exceptionType) {
      //   throw new exceptionType(error.message);
      // } else {
      //   throw new InternalServerErrorException('An unexpected error occurred.');
      // }
    }
  }

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
