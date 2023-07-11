import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  // @ts-ignore stripe-version-2022-08-01
  apiVersion: "2022-08-01",
  appInfo: {
    name: 'Ignite Shop',
  }
})