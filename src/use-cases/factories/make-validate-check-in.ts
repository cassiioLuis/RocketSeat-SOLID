import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { ValidateCheckInUseCase } from "../validate-check-in";

export function makeValidateCheckIn() {
    const useCase = new ValidateCheckInUseCase(new PrismaCheckInsRepository());

    return useCase;
}