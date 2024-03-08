import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field()
  email: string;

  @Field()
  isActive: number;

  @Field()
  category: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  role: string;
}
