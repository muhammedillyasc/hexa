import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateStoreInput {
  @Field()
  @IsNotEmpty()
  storeCode: string;

  @Field()
  @IsNotEmpty()
  country: string;
}
