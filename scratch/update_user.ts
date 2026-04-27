import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const oldEmail = 'kagurawogyo@gmail.com'
  const newEmail = 'pelitabondowoso@gmail.com'
  const newPassword = 'pelita123'
  
  try {
    // Check if new email is already taken
    const existing = await prisma.user.findUnique({
      where: { email: newEmail }
    })
    
    if (existing && existing.email !== oldEmail) {
       console.log(`Error: Email ${newEmail} is already taken by another user.`)
       return
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    
    const user = await prisma.user.update({
      where: { email: oldEmail },
      data: { 
        email: newEmail,
        password: hashedPassword
      }
    })
    console.log(`Success! User updated to ${user.email} with new password.`)
  } catch (error) {
    console.error('Error updating user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
