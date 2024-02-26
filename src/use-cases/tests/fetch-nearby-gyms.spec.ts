import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository';
import { SearchGymsUseCase } from '../search-gyms';
import { FeatchNearbyGymsUseCase } from '../fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FeatchNearbyGymsUseCase;

describe('Fetch nearby gyms', () => {

    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new FeatchNearbyGymsUseCase(gymsRepository);
    });

    it('should be able to featch nearby gyms', async () => {

        await gymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: -27.8143599,
            longitude: -50.3172257,
        });

        await gymsRepository.create({
            title: 'For Gym',
            description: null,
            phone: null,
            latitude: -27.6571695,
            longitude: -50.58184
        })

        const { gyms } = await sut.execute({
            userLatitude: -27.8143599,
            userLongitude: -50.3172257,
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);

    });

});