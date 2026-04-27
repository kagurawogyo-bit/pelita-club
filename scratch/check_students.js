const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'SISWA' },
    include: { profile: true }
  });

  console.log('--- Current Students ---');
  users.forEach(u => {
    console.log(`ID: ${u.id}, Email: ${u.email}, Name: ${u.profile?.namaLengkap || 'NULL'}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
