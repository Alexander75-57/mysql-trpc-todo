1. сервр trp - src/server/trpc.ts

2. src/server/context.ts  - создает контекст для tRPC сервера, который содержит информацию об аутентификации пользователя. Функция createContext получает данные о текущем пользователе через Clerk и предоставляет их всем tRPC процедурам. Тип Context определяет структуру данных контекста для типизации в TypeScript. 

3. маршрутизатор-роутер - src/server/routes/index.ts 

4. src/app/api/clerkhooks/route.ts обрабатывает веб-хуки от Clerk. Он прослушивает событие создания нового пользователя (user.created) и автоматически создает соответствующую запись в базе данных в таблице Customers.Когда пользователь регистрируется через Clerk, этот обработчик получает уведомление и сохраняет данные пользователя (ID, имя, фамилию, email) в локальную базу данных для дальнейшего использования в приложении. Этот файл не импортируется другими компонентами - он работает как standalone API endpoint, который Clerk автоматически вызывает при создании нового пользователя.

5. обработчик маршрута - src/app/api/trpc/[trpc]/route.ts используем для Nexths fetch - adapters

6. клиент trpc - src/app/_trpc/client.ts The tRPC route handler needs CORS headers added(This allows cross-origin requests from your ngrok domain to the localhost API ). Here's the fix - src/app/api/trpc/[trpc]/route.ts

7. src/app/_trpc/Provider.tsx используем localhost URL to use window.location.origin, which will automatically use the correct domain whether it's localhost, ngrok, or any other deployment URL

8. клиент запроса react на все дочернии элементы ({children}) - src/app/_trpc/Provider.tsx

9. src/components/Container.tsx создает переиспользуемый компонент-контейнер для ограничения ширины контента и его центрирования на странице. Он применяет CSS-классы: максимальная ширина 5xl (1024px), центрирование через mx-auto и горизонтальные отступы по 20px. Компонент принимает стандартные пропы div-элемента и позволяет добавлять дополнительные CSS-классы через className. Он оборачивает весь интерфейс todo-листа на странице дашборда, обеспечивая ограничение ширины контента, центрирование и добавляя вертикальную компоновку элементов.

10. клиент запроса передаём в src/app/layout.tsx
11. клиент компанент запросов - src/app/_components/TodoList.tsx
12. результата компанент запросов передаём - src/app/page.tsx ......
13. src/app/_trpc/serverClient.ts - избежать мерцании страницы при её обновлении


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
