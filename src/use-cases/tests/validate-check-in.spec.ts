import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { ValidateCheckInUseCase } from '../validate-check-in';
import { ResourceNotFoundError } from '../errors/resource-not-found';
import { LateCheckInValidationError } from '../errors/late-check-in-validation';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate check-in', () => {

    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new ValidateCheckInUseCase(checkInsRepository);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to validate the check-in', async () => {

        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        });

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id
        });

        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));

    });

    it('should not be able to validate an inexistent check-in', async () => {

        await expect(() =>
            sut.execute({
                checkInId: 'inexistent-check-in-id'
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);

    });

    it('should not be able to validate check-in after 20 minutes after the cration', async () => {

        vi.setSystemTime(new Date(2024, 0, 1, 13, 40));

        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        });

        vi.advanceTimersByTime(1000 * 60 * 21); // 21 minutes in mileseconds

        await expect(() =>
            sut.execute({
                checkInId: createdCheckIn.id
            })
        ).rejects.toBeInstanceOf(LateCheckInValidationError);

    });


});