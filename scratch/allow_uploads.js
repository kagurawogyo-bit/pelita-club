const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Allowing public uploads to 'documents' bucket...");
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Public Uploads" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'documents');
    `).catch(e => console.log("Policy already exists or error:", e.message));
    console.log("Policy added!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
