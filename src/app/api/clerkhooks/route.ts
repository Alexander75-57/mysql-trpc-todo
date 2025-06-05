import { WebhookEvent } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { db } from '@/db'
import { Customers } from '@/db/schema'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``

async function validateRequest(request: Request) {
  const payloadString = await request.text()
  const headerPayload = headers()

  const svixHeaders = {
    'svix-id': (await headerPayload).get('svix-id')!,
    'svix-timestamp': (await headerPayload).get('svix-timestamp')!,
    'svix-signature': (await headerPayload).get('svix-signature')!,
  }
  const wh = new Webhook(webhookSecret)
  return wh.verify(payloadString, svixHeaders) as WebhookEvent
}

export async function POST(request: Request) {
  try {
    const payload = await validateRequest(request)
    //console.log('Webhook payload:', payload)
    
    // Check if this is a user.created event
    if (payload.type === 'user.created') {
      const { id, first_name, last_name, email_addresses, primary_email_address_id } = payload.data
      
      // Get primary email
      const primaryEmail = email_addresses.find(
        email => email.id === primary_email_address_id
      )?.email_address
      
      if (!primaryEmail) {
        console.error('No primary email found for user:', id)
        return Response.json({ error: 'No primary email found' }, { status: 400 })
      }
      
      // Insert new customer into database
      await db.insert(Customers).values({
        clerkId: id, // Store Clerk user ID
        firstName: first_name || '',
        lastName: last_name || '',
        email: primaryEmail,
        active: true,
      })
      
      console.log('Created new customer for Clerk ID:', id)
      
      return Response.json({ 
        message: 'User created successfully',
        clerkId: id
      })
    }
    
    return Response.json({ message: 'Webhook received' })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return Response.json({ error: 'Error processing webhook' }, { status: 500 })
  }
}