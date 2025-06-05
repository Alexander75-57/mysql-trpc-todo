import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { todoRouter } from '@/server/routers/index'
import { createContext } from '@/server/context'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: todoRouter,
    createContext,
    responseMeta() {
      return {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    },
  })

export { handler as GET, handler as POST, handler as OPTIONS }