import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteStoreInput {
  @Field()
  storeCode: string;
}
