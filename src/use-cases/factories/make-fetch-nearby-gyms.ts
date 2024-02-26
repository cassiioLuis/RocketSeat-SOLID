import { FeatchNearbyGymsUseCase } from "../fetch-nearby-gyms";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeFetchNearbyGyms() {
    const useCase = new FeatchNearbyGymsUseCase(new PrismaGymsRepository());

    return useCase;
}