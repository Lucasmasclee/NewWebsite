const express = require('express');
const stripe = require('stripe')('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'); // Replace with your actual secret key
const cors = require('cors');
const path = require('path'); // Import the path module

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    // Create a checkout session with 'ideal' and 'card' as payment methods
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['ideal', 'card'], // Adding iDEAL as a payment method
      line_items: [
        {
          price_data: {
            currency: 'eur', // iDEAL requires EUR currency
            product_data: {
              name: 'Simple Website Payment',
            },
            unit_amount: 170, // Amount in cents (4.70 EUR)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:4242/success.html',
      cancel_url: 'http://localhost:4242/cancel.html',
    });

    console.log('Checkout session created:', session);
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(4242, () => console.log('Server running on http://localhost:4242'));
