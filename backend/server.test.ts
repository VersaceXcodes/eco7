import request from 'supertest';
import { app, pool } from './server.ts';
import WebSocket from 'ws';
import { createServer } from 'http';

// Mock the database connection to use test environment setup
jest.mock('./database/connection');

// Utility function to wrap WebSocket events
async function waitForSocketEvent(socket, event) {
  return new Promise((resolve, reject) => {
    socket.on(event, resolve);
    socket.on('error', reject);
  });
}

describe('Eco7 API Integration Tests', () => {
  let server;
  let socketServer;
  let client;

  beforeAll((done) => {
    server = app.listen(4000, () => {
      socketServer = new WebSocket.Server({ server });
      done();
    });
  });

  afterAll((done) => {
    pool.end(() => {
      server.close(() => {
        done();
      });
    });
  });

  // Test - User Registration
  describe('POST /auth/register', () => {
    const userPayload = {
      email: 'testuser@example.com',
      name: 'Test User',
      password_hash: 'testpassword', // Use plain text for testing
    };

    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send(userPayload)
        .expect(200);

      expect(res.body).toHaveProperty('auth_token');
      expect(res.body.user.email).toBe(userPayload.email);
    });

    it('should not allow registration with an existing email', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send(userPayload)
        .expect(409);

      expect(res.body.error).toBeTruthy();
    });
  });

  // Test - Login
  describe('POST /auth/login', () => {
    it('should log in the user and return an auth token', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'testpassword', // Use plain text for testing
        })
        .expect(200);

      expect(res.body).toHaveProperty('auth_token');
    });

    it('should not log in with incorrect credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'wrongemail@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(res.body.error).toBeTruthy();
    });
  });

  // Test - WebSocket
  describe('WebSocket: forum/thread/new', () => {
    it('should broadcast new forum thread events', async (done) => {
      const wsClient = new WebSocket('ws://localhost:4000/user/created');
      
      wsClient.on('open', async () => {
        wsClient.send(JSON.stringify({
          operationId: 'onNewForumThread',
          data: {
            thread_id: 'testthread1',
            user_id: 'testuser1',
            title: 'New Discussion Thread',
            content: 'Discuss sustainability practices here!',
          },
        }));
        
        const message = await waitForSocketEvent(wsClient, 'message');

        expect(JSON.parse(message)).toMatchObject({
          thread_id: 'testthread1',
          title: 'New Discussion Thread',
        });
        
        wsClient.close();
        done();
      });
    });
  });
});