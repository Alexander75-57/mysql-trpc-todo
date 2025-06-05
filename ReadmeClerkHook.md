  Step-by-Step Clerk Webhook Configuration:

  1. Go to Clerk Dashboard

  - Visit: https://dashboard.clerk.com
  - Login to your account
  - Select your application

  2. Navigate to Webhooks

  - In the left sidebar, look for "Webhooks"
  - It's usually under the "Configure" section
  - Click on "Webhooks"

  3. Add Webhook Endpoint

  - Click "Add Endpoint" or "Create Endpoint"
  - Enter your webhook URL:
    - For local testing: http://localhost:3000/api/clerkhooks (if use tunnel https://your-ngrok-url.ngrok.io/api/clerkhooks)
    - For production: https://yourdomain.com/api/clerkhooks

  4. Configure Events

  - Select "user.created" event
  - You can also select other events like user.updated, user.deleted if needed

  5. Set Signing Secret

  - Use the webhook secret from your .env file: whsec_ujBOONNLOY6eGg0nbJUDGsGmsJPhOOiK

  6. For Local Development

  Since localhost isn't accessible from the internet, you have two options:

  Option A: Use ngrok (Recommended for testing)
  # Install ngrok if you don't have it
  npm install -g ngrok

  # Expose your local server
  ngrok http 3000
  Then use the ngrok URL in Clerk webhook: https://your-ngrok-url.ngrok.io/api/clerkhooks

  Option B: Deploy to test
  Deploy your app to Vercel/Netlify and use the production URL.

  Once configured, create a new user through your sign-up page and the webhook will automatically send the user.created event to your endpoint, which will then add the user to your MySQL database.