const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Creating bucket in Supabase via SQL...");
    // Create bucket
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('documents', 'documents', true)
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);
    
    console.log("Bucket 'documents' created successfully!");
    
    // Add policy to allow public read access
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'documents');
    `).catch(e => console.log("Policy might already exist:", e.message));

  } catch (error) {
    console.error("Error creating bucket:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
