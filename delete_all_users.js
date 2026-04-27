const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Menghapus semua data...');
  
  // Delete profiles first
  await prisma.profile.deleteMany({});
  console.log('Semua profil telah dihapus.');
  
  // Delete users
  const deleted = await prisma.user.deleteMany({});
  console.log(`${deleted.count} akun telah dihapus.`);
  
  console.log('Database bersih.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
