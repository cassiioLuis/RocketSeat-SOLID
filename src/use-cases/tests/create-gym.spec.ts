import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository';
import { CreateGymUseCase } from '../create-gym';

let gymRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Register user case', () => {

    beforeEach(() => {
        gymRepository = new InMemoryGymsRepository();
        sut = new CreateGymUseCase(gymRepository);
    })

    it('should be able to create a Gym', async () => {

        const { gym } = await sut.execute({
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            latitude: -27.8143599,
            longitude: -50.3172257,
        });

        expect(gym.id).toEqual(expect.any(String));
    });

});

