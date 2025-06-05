import { db } from '@/db'
import { Customers } from '@/db/schema'

export async function GET() {
  try {
    const customers = await db.select().from(Customers)
    
    return Response.json({
      success: true,
      count: customers.length,
      customers: customers
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}