This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/DashboardModule.test.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Testing accounts:
admin@admin.com

## To refactor
1) UUID is always string
2) anon fns
3) util - findFromLookup
4) Requests queue - refactor to class instance for example
5) union separate .test yup methods
6) rework filters for pages: Orders, Examinations
7) think about to create hook: useKeyPress
8) remove treeView
9) clean up fields on both BE and FE sides, "exams_templates_uuids" | "exam_template_uuids" | ["exam_template_uuid"] | [{exam_template_uuid: "some uuid"}] and so on
10) Remove all mentions of InnerFormContainer from components (instead steppers)
11) Remove useClickAway from Popper containers (useClickAway already use inside Popper component)
