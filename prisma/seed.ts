import { hash } from 'bcrypt';
import { categories, users } from './data';
import { PrismaClient } from '.prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hashed = async (password: any) => {
    return hash(password, 10);
  };
  categories.forEach(async (category) => {
    const cat = prisma.category.create({
      data: category,
    });
    await prisma.$transaction([cat]);
  });
  users.forEach(async (user) => {
    const userCreated = await prisma.user.create({
      data: {
        username: user.username,
        fullname: user.fullname,
        password: await hashed(user.password),
        role: user.role,
      },
    });
    await prisma.rule.create({
      data: {
        userId: userCreated.id,
      },
    });
  });
}

main()
  .catch(() => {
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
