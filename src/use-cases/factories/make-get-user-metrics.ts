import { GetUserMetricsUseCase } from "../get-user-metrics";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeGetUserMetrics() {
    const useCase = new GetUserMetricsUseCase(new PrismaCheckInsRepository());

    return useCase;
}