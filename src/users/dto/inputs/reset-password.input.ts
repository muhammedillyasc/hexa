import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResetPasswordInput {
  @Field()
  currentPassword: string;

  @Field()
  updatedPassword: string;
}
