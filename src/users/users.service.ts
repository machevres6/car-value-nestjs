import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, password: string) {
        const user = this.repo.create({ email, password });

        return this.repo.save(user);
    }

    findOne(id: number) {
        if (!id) {
            return null;
        }
        return this.repo.findOneBy({ id });
    }

    find(email: string) {
        return this.repo.find({ where: { email }});
    }

    async update(id: number, attrs: Partial<User>) {
        const returnedUser = await this.findOne(id);

        if (!returnedUser) {
            throw new NotFoundException('User not found for update')
        }
        
        Object.assign(returnedUser, attrs);
        return this.repo.save(returnedUser);
    }

    async remove(id: number) {
        const user = await this.findOne(id);

        if (!user) {
            throw new NotFoundException('User not found for deletion')
        }

        return this.repo.remove(user);
    }
}
