import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { CheckInUseCase } from '../checkin';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository';
import { Decimal } from '@prisma/client/runtime/library';
import exp from 'constants';
import { MaxDistanceError } from '../errors/max-distance-error';
import { MaxNumberOfCheckInsError } from '../errors/mas-number-of-check-ins';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Get useGymse', () => {

    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(checkInsRepository, gymsRepository);
        vi.useFakeTimers();

        await gymsRepository.create({
            id: 'gym-01',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: 0,
            longitude: 0,
            created_at: new Date()
        });

    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to check in', async () => {

        vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        });

        expect(checkIn.id).toEqual(expect.any(String));

    });

    it('should not be able to check in on distant gym', async () => {

        gymsRepository.items.push({
            id: 'gym-02',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-27.8143599),
            longitude: new Decimal(-50.3172257),
            created_at: new Date()
        });

        await expect(() =>
            sut.execute({
                gymId: 'gym-02',
                userId: 'user-01',
                userLatitude: -27.7271062,
                userLongitude: -50.2691434
            })
        ).rejects.toBeInstanceOf(MaxDistanceError);

    });

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        });

        await expect(() =>
            sut.execute({
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: 0,
                userLongitude: 0
            })
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);

    });

    it('should be able to check in twice but in the different days', async () => {
        vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        });

        vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0));

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        });

        expect(checkIn.id).toEqual(expect.any(String));

    });

});