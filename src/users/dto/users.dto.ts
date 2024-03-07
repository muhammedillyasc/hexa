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
