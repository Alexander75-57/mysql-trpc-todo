'use client'

import { createTRPCReact } from '@trpc/react-query'

import type { TodoRouter } from '@/server/routers/index'

export const trpc = createTRPCReact<TodoRouter>({})