import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  confirmPassword: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;
}
