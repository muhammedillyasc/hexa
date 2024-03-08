import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteUserAccount {
  @Field()
  email: string;
}
