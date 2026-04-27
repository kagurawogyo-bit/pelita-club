const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@pelita.com',
      password: hashedPassword,
      role: 'PENGURUS',
      profile: {
        create: {
          namaLengkap: 'Admin Utama',
          nomorHp: '08123456789',
          nik: '1234567890123456'
        }
      }
    }
  });

  console.log('Admin default berhasil dibuat:');
  console.log('Email: admin@pelita.com');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
