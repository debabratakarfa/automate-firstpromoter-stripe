import express from 'express';
import bodyParser from 'body-parser';
import request from 'supertest';
import expect from 'chai';
import nock from 'nock';
import dotenv from 'dotenv';

dotenv.config();

import { automateTask } from '../index.js';

// Mock endpoint
const app = express();
app.use(bodyParser.json());

app.post('/automate', async (req, res) => {
  const { promoterId, promoterData } = req.body;
  try {
    await automateTask(promoterId, promoterData);
    res.status(200).json({ message: 'Task completed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the task' });
  }
});

const FIRST_PROMOTER_API_BASE_URL = 'https://api.firstpromoter.com/v1';

describe('POST /automate', () => {
  beforeEach(() => {
    nock(FIRST_PROMOTER_API_BASE_URL)
      .put(/\/promoter\/.*/)
      .reply(200, { success: true });

    nock('https://api.stripe.com')
      .post('/v1/coupons')
      .reply(200, { id: 'unique_coupon_id' });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should complete the task successfully', (done) => {
    const promoterId = 'test_promoter_id';
    const promoterData = {
      email: 'test-email@example.com',
      custom_field: 'test-value'
    };

    request(app)
      .post('/automate')
      .send({ promoterId, promoterData })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('Task completed successfully');
        done();
      });
  });

  it('should return an error if promoterId is missing', (done) => {
    const promoterData = {
      email: 'test-email@example.com',
      custom_field: 'test-value'
    };

    request(app)
      .post('/automate')
      .send({ promoterData })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors).to.exist;
        done();
      });
  });

  it('should return an error if promoterData is missing', (done) => {
    const promoterId = 'test_promoter_id';

    request(app)
      .post('/automate')
      .send({ promoterId })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors).to.exist;
        done();
      });
  });

  it('should handle external API errors gracefully', (done) => {
    nock.cleanAll();

    nock(FIRST_PROMOTER_API_BASE_URL)
      .put(/\/promoter\/.*/)
      .replyWithError('External API error');

    const promoterId = 'test_promoter_id';
    const promoterData = {
      email: 'test-email@example.com',
      custom_field: 'test-value'
    };

    request(app)
      .post('/automate')
      .send({ promoterId, promoterData })
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).to.equal('An error occurred while processing the task');
        done();
      });
  });
});
