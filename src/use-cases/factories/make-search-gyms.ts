import { SearchGymsUseCase } from "../search-gyms";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeSearchGyms() {
    const useCase = new SearchGymsUseCase(new PrismaGymsRepository());

    return useCase;
}