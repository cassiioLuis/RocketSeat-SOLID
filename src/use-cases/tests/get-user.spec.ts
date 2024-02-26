import { expect, describe, it, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { GetUserProfilerUseCase } from '../get-user-profiler';
import { ResourceNotFoundError } from '../errors/resource-not-found';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfilerUseCase;

describe('Get user Profile', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfilerUseCase(usersRepository);
    })

    it('should be able to get user profile', async () => {
        const createdUser = await usersRepository.create({
            name: 'Jhon Doe',
            email: 'john@doe.com.br',
            password_hash: await hash('123456', 6)
        });

        const { user } = await sut.execute({
            userId: createdUser.id
        });

        expect(user.id).toEqual(expect.any(String));
        expect(user.name).toEqual(createdUser.name);
    });

    it('should not be able to get user profile with worng id', async () => {

        await expect(() => sut.execute({
            userId: 'non-existing-id'
        })).rejects.toBeInstanceOf(ResourceNotFoundError);

    });

});