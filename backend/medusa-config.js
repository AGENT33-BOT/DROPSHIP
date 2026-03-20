// medusa-config.js
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  projectConfig: {
    // Database
    databaseUrl: process.env.DATABASE_URL,
    databaseDriver: "postgres",
    database: {
      type: "postgres",
      url: process.env.DATABASE_URL,
      logging: false,
      max: 10,
    },
    
    // Redis
    redisUrl: process.env.REDIS_URL,
    
    // JWT
    jwtSecret: process.env.JWT_SECRET,
    
    // Server
    serverConfig: {
      port: 9000,
    },
  },

  plugins: [
    // Stripe
    {
      resolve: `medusa-payment-stripe`,
      options: {
        config: {
          stripe: {
            apiKey: process.env.STRIPE_SECRET_KEY,
            webhooks: {
              STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
            },
          },
        },
      },
    },
    
    // Redis for events
    {
      resolve: `@medusajs/event-bus-redis`,
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
  ],

  modules: {
    // Pricing module
    pricingService: {
      resolve: `@medusajs/pricing`,
    },
  },
};
