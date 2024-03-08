import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from './schemas/store.schema';

import { JwtModule } from '@nestjs/jwt';
import { JWT_CONFIG } from 'src/config/jwt.config';
import { AuthSchema } from './schemas/auth.schema';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { AuthGuard } from './guard/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'store', schema: StoreSchema },
      { name: 'auth', schema: AuthSchema },
    ]),
    JwtModule.register({
      secret: JWT_CONFIG.secretKey,
      signOptions: { expiresIn: JWT_CONFIG.expiresIn },
    }),
  ],
  exports: [],
  controllers: [],
  providers: [UsersResolver, UsersService, AuthGuard],
})
export class UsersModule {}
