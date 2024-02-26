import { expect, describe, it, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from '../authenticate';
import { InvalidCredentialsError } from '../errors/invalid-credencials';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate user case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);
    })

    it('should be able to authenticate', async () => {
        await usersRepository.create({
            name: 'Jhon Doe',
            email: 'john@doe.com.br',
            password_hash: await hash('123456', 6)
        });

        const { user } = await sut.execute({
            email: 'john@doe.com.br',
            password: '123456'
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should not be able to authenticate with worng email', async () => {

        await expect(() => sut.execute({
            email: 'mail@doe.com.br',
            password: '123456'
        })).rejects.toBeInstanceOf(InvalidCredentialsError);

    });

    it('should not be able to authenticate with worng password', async () => {

        await usersRepository.create({
            name: 'Jhon Doe',
            email: 'john@doe.com.br',
            password_hash: await hash('123456', 6)
        });

        await expect(() => sut.execute({
            email: 'john@doe.com.br',
            password: '654321'
        })).rejects.toBeInstanceOf(InvalidCredentialsError);

    });

});