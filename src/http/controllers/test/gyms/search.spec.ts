import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user';

describe('Search Gym controller', () => {

    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to search gyms', async () => {

        const { token } = await createAndAuthenticateUser(app, true);

        await request(app.server)
            .post('/gyms')
            .set('Authorization', 'Bearer ' + token)
            .send({
                title: 'JavaScript Gym',
                description: 'Some description',
                phone: '11999999999',
                latitude: -27.8143599,
                longitude: -50.3172257
            });

        await request(app.server)
            .post('/gyms')
            .set('Authorization', 'Bearer ' + token)
            .send({
                title: 'TypeScript Gym',
                description: 'Some description',
                phone: '11999999999',
                latitude: -27.8143599,
                longitude: -50.3172257
            });


        const response = await request(app.server)
            .get('/gyms/search')
            .query({ query: 'JavaScript' })
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym' })
        ]);

    });

});