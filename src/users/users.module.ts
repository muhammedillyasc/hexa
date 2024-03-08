import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from './schemas/store.schema';

import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { AuthSchema } from './schemas/auth.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'store', schema: StoreSchema },
      { name: 'auth', schema: AuthSchema },
    ]),
  ],
  exports: [],
  controllers: [],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
