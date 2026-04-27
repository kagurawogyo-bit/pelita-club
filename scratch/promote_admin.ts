import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'kagurawogyo@gmail.com'
  
  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: { role: 'PENGURUS' }
    })
    console.log(`Success! User ${user.email} is now PENGURUS.`)
  } catch (error) {
    console.error('Error updating user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
