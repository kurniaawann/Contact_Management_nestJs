import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    testService = app.get(TestService);
    await app.init();
  });

  describe('POST', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('Should be reject if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          username: '',
          password: '',
          name: '',
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeUndefined();
    });

    it('Should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    });

    it('Should be reject if username already exist', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('Login', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('Should be reject if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: '',
          password: '',
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeUndefined();
    });

    it('Should be able to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test',
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.token).toBeDefined();
    });
  });
});
