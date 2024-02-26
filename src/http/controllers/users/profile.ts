import { makeGetUserProfiler } from '@/use-cases/factories/make-get-user-profiler';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function profile(request: FastifyRequest, reply: FastifyReply) {

    const getUserProfile = makeGetUserProfiler();

    const { user } = await getUserProfile.execute({
        userId: request.user.sub
    });


    return reply.status(200).send({
        user: {
            ...user,
            password_hash: undefined
        }
    });
}