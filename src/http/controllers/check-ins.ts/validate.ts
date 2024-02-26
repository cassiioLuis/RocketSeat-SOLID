import { FastifyRequest, FastifyReply } from "fastify";
import { string, z } from "zod";
import { makeValidateCheckIn } from "@/use-cases/factories/make-validate-check-in";

export async function validate(request: FastifyRequest, reply: FastifyReply) {

    const validateCheckInParamsSchema = z.object({
        checkInId: z.string().uuid()
    });

    const { checkInId } = validateCheckInParamsSchema.parse(request.params);

    const validadeCheckInUseCase = makeValidateCheckIn();

    await validadeCheckInUseCase.execute({
        checkInId
    });

    return reply.status(204).send();
}