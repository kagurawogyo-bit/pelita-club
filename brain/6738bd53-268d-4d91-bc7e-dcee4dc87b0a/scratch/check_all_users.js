const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      include: { profile: true }
    });
    console.log("Total Users:", users.length);
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
