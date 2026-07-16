const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: { profile: true },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`Total users in PostgreSQL: ${users.length}`);
  users.forEach(u => {
    console.log(`ID: ${u.id}`);
    console.log(`  Email: ${u.email}`);
    console.log(`  Role: ${u.role}`);
    console.log(`  Name: ${u.profile?.namaLengkap || 'N/A'}`);
    console.log(`  Created At: ${u.createdAt}`);
    console.log('----------------------------------------');
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
