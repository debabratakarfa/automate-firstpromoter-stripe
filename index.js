require('dotenv').config();
const express = require('express');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const helmet = require('helmet');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

// FirstPromoter API base URL
const FIRST_PROMOTER_API_BASE_URL = 'https://api.firstpromoter.com/v1';

// Function to generate a unique 16-digit identifier
function generateUniqueId() {
  return Math.random().toString().slice(2, 18);
}

// Function to modify an existing promoter
async function modifyPromoter(promoterId, promoterData) {
  try {
    const response = await axios.put(
      `${FIRST_PROMOTER_API_BASE_URL}/promoter/${promoterId}`,
      promoterData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.FIRST_PROMOTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error modifying promoter:', error);
    throw error;
  }
}

// Function to create a new coupon in Stripe
async function createStripeCoupon(data) {
  try {
    const coupon = await stripe.coupons.create(data);
    return coupon;
  } catch (error) {
    console.error('Error creating Stripe coupon:', error);
    throw error;
  }
}


// Function to automate the task
async function automateTask(promoterId, promoterData) {
  try {
    const modifiedPromoter = await modifyPromoter(promoterId, promoterData);
    console.log('Modified Promoter:', modifiedPromoter);

    const couponData = {
      duration: 'once',
      percent_off: 25,
      id: generateUniqueId() // Generate a unique 16-digit identifier
    };

    const coupon = await createStripeCoupon(couponData);
    console.log('Created Stripe Coupon:', coupon);

  } catch (error) {
    console.error('Error in automateTask:', error);
  }
}

// Create an Express application
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Define a route to accept promoterId and promoterData with validation
app.post('/automate', [
  body('promoterId').isString().notEmpty(),
  body('promoterData').isObject().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { promoterId, promoterData } = req.body;

  try {
    await automateTask(promoterId, promoterData);
    res.status(200).json({ message: 'Task completed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the task' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
