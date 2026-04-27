const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const coaches = [
  { name: 'Coach Yudik', email: 'yudik@pelita.com' },
  { name: 'Coach Iluk', email: 'iluk@pelita.com' },
  { name: 'Coach Tio', email: 'tio@pelita.com' },
  { name: 'Coach Aldi', email: 'aldi@pelita.com' },
  { name: 'Coach Ilham', email: 'ilham@pelita.com' },
  { name: 'Coach Galih', email: 'galih@pelita.com' },
];

async function main() {
  console.log("Starting to add coaches...");
  const password = await bcrypt.hash('pengurus123', 10);

  for (const coach of coaches) {
    try {
      const user = await prisma.user.create({
        data: {
          email: coach.email,
          password: password,
          role: 'PENGURUS',
          profile: {
            create: {
              namaLengkap: coach.name,
              jenisKelamin: 'LAKI_LAKI', // Default
            }
          }
        }
      });
      console.log(`Added: ${coach.name} (${coach.email})`);
    } catch (e) {
      console.error(`Failed to add ${coach.name}: ${e.message}`);
    }
  }
  console.log("Finished adding coaches.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
