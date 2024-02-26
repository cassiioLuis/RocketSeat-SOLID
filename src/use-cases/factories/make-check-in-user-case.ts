import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { CheckInUseCase } from "../checkin";

export function makeCheckIn() {
    const useCase = new CheckInUseCase(
        new PrismaCheckInsRepository(),
        new PrismaGymsRepository()
    );

    return useCase;
}