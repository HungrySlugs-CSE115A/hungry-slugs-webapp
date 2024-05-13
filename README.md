This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Running Code

- Make sure to have a private folder in the root directory that contains all secrets. (for now you can get this folder from our shared google drive folder) [link](https://drive.google.com/drive/folders/1oz7vGXPAI2S8vzYIpQ2ATTfjgqFHDD_p?usp=sharing)
- Make sure that you have all the python dependencies installed in the requirements.txt
- Make sure to install JS dependencies with `bun i` or `npm i`
- you then will have to have two terminals to run backend and frontend
- the backend is run with: `python backend/manage.py runserver`
- the frontend is run one of the commands below in the Getting Started
- Also, if you have nix installed with flakes you can skip most of the environment setup steps and use `nix develop` to setup your dev environment

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
