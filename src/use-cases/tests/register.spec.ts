import { expect, describe, it, beforeEach } from 'vitest';
import { RegisterUseCase } from '../register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from '../errors/user-already-exists';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register user case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new RegisterUseCase(usersRepository);
    })

    it('should hash user password upon registration', async () => {
        
        const { user } = await sut.execute({
            name: 'John Dow',
            email: 'john@doe.com.br',
            password: '123456'
        });

        const isPassowrdCorrectly = await compare('123456', user.password_hash);
        expect(isPassowrdCorrectly).toBe(true);
    });

    it('should not be able to register with same email twice', async () => {

        const email = 'johndow@example.com'

        await sut.execute({
            name: 'John Dow',
            email,
            password: '123456'
        });

        await expect(() => 
            sut.execute({
                name: 'John Dow',
                email: email,
                password: '123456'
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);

    });

    it('should be able to register', async () => {

        const { user } = await sut.execute({
            name: 'John Dow',
            email: 'john@doe.com.br',
            password: '123456'
        });

        expect(user.id).toEqual(expect.any(String));
    });

});

