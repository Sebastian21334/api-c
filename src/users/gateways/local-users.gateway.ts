import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

import { ExternalUser } from '../user.types';
import { UsersGateway } from './users.gateway';

@Injectable()
export class LocalUsersGateway implements UsersGateway {

  private users: ExternalUser[] = [];

  constructor() {
    const filePath = join(process.cwd(), 'src', 'users','data','users.json',);
    const file = readFileSync(filePath, 'utf8');
    this.users = JSON.parse(file) as ExternalUser[];
  }

  async fetchAll(): Promise<ExternalUser[]> {
    return this.users;
  }

}