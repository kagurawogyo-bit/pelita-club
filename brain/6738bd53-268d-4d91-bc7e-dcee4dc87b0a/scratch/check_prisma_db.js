const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./prisma/dev.db'
    }
  }
});

async function main() {
  try {
    const users = await prisma.user.findMany({
      include: { profile: true }
    });
    console.log("Users in prisma/dev.db:", users.length);
    users.forEach(u => {
      console.log(`- Role: ${u.role}, Email: ${u.email}, Name: ${u.profile?.namaLengkap}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
