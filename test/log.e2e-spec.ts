import * as supertest from 'supertest'
import { Test } from '@nestjs/testing'
import { describe } from 'node:test'
import { INestApplication } from '@nestjs/common'
import { LogModule } from '../src/log/log.module'
import { LogService } from '../src/log/log.service'

describe('log', () => {
    let app: INestApplication;
    let logService = { findAll: () => ['test'] };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [LogModule]
        }).overrideProvider(LogService)
            .useValue(logService)
            .compile();
        app = moduleRef.createNestApplication();
        await app.init();
    })

    it(`/GET api/log`, () => {
        return supertest(app.getHttpServer())
            .get(`/api/log`)
            .expect(200)
            .expect({ data: logService.findAll })
    });

    afterAll(async () => {
        await app.close();
    })
})