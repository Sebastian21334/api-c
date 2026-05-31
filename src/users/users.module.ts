import { Global, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { JsonPlaceholderUsersGateway } from './gateways/jsonplaceholder-users.gateway';
import { LocalUsersGateway } from './gateways/local-users.gateway';
import { USERS_GATEWAY } from './gateways/users.gateway';
import { UsersService } from './services/users.service';

@Global()
@Module({
  controllers: [UsersController],
  providers: [UsersService,
    {
      provide: USERS_GATEWAY,
      useFactory: () => {
        if (process.env.USERS_SOURCE === 'local') {
          return new LocalUsersGateway();
        }
        return new JsonPlaceholderUsersGateway();
      },
    },
  ],
  exports: [UsersService, USERS_GATEWAY],
})
export class UsersModule {}