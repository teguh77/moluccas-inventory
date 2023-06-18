This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Pertama, install terlebih dahulu 'dependencies' nya:

```bash
npm i
```

Kedua, buat file .env untuk menyimpan 'environment variable', lihat referensi .env.example<br><br>

Setelah itu, jalankan program:

```bash
npm run dev
```

Selain itu, untuk seeding database dapat dilakukan dengan cara :
```bash
npx prisma migrate dev --name <NAME>

npx prisma db seed
```


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
