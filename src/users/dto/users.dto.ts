import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Store {
  @Field()
  _id: string;

  @Field()
  country: string;

  @Field()
  storeCode: number;
}

@ObjectType()
export class UserResponse {
  @Field()
  _id: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field({ nullable: true })
  category?: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  image?: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;

  @Field()
  isActive?: number;

  //fields is not mandatory if you are not returning to the g
  password?: string;
}

@ObjectType()
export class UserWithTokenResponse {
  @Field()
  token: string;

  @Field(() => UserResponse)
  user: UserResponse;
}
