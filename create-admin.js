const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  const newUser = await prisma.user.create({
    data: {
      email: "admin@club.com",
      password: hashedPassword,
      role: "PENGURUS",
      profile: {
        create: {
          namaLengkap: "Admin Pengurus Utama",
          nik: "1234567890123456",
          nomorHp: "08123456789",
          tempatLahir: "Jakarta",
          tanggalLahir: new Date("1990-01-01"),
          jenisKelamin: "LAKI_LAKI",
          agama: "ISLAM",
          alamat: "Jl. Olahraga No 1, Jakarta",
          namaAyah: "Ayah Admin",
          namaIbu: "Ibu Admin"
        }
      }
    }
  });
  console.log("SUCCESS! Admin created with email: admin@club.com and password: password123");
}

main().catch(e => {
  console.error("ERROR:", e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
