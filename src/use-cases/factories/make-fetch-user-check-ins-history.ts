import { FetchUserCheckInsHistoryUseCase } from "../fetch-user-check-ins-history";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeFetchUserCheckInsHistory() {
    const useCase = new FetchUserCheckInsHistoryUseCase(new PrismaCheckInsRepository());

    return useCase;
}