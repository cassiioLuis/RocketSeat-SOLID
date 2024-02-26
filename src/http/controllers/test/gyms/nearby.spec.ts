import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user';

describe('Nearby Gym controller', () => {

    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to search nearby gyms', async () => {

        const { token } = await createAndAuthenticateUser(app, true);

        // Nearby Gym
        await request(app.server)
            .post('/gyms')
            .set('Authorization', 'Bearer ' + token)
            .send({
                title: 'JavaScript Gym',
                description: 'Some description',
                phone: '11999999999',
                latitude: -27.8143599,
                longitude: -50.3172257,
            });


        // Far Away Gym
        await request(app.server)
            .post('/gyms')
            .set('Authorization', 'Bearer ' + token)
            .send({
                title: 'TypeScript Gym',
                description: 'Some description',
                phone: '11999999999',
                latitude: -27.6571695,
                longitude: -50.58184
            });


        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -27.8143599,
                longitude: -50.3172257
            })
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym' })
        ]);

    });

});