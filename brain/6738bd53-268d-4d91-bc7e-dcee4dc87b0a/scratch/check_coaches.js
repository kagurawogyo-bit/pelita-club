const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pengurus = await prisma.user.findMany({
    where: { role: 'PENGURUS' },
    include: { profile: true }
  });
  console.log("Pengurus List:");
  pengurus.forEach(p => {
    console.log(`- Email: ${p.email}, Name: ${p.profile?.namaLengkap}`);
  });
}

main();
