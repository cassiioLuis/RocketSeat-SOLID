import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetUserProfilerUseCase } from "../get-user-profiler";

export function makeGetUserProfiler() {
    const useCase = new GetUserProfilerUseCase(new PrismaUsersRepository());

    return useCase;
}