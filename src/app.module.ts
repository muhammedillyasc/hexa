import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { ApolloDriver } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      driver: ApolloDriver,
      context: ({ req, res }) => ({ req, res }),
      playground: true,
    }),
    MongooseModule.forRoot('mongodb://localhost/hexa'),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
