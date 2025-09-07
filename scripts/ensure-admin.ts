#!/usr/bin/env bun

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function ensureAdmin() {
  const adminEmail = 'jeffreyverlynjohnson@gmail.com';
  
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingUser) {
      // Update to admin if not already
      if (existingUser.role !== 'ADMIN') {
        const updated = await prisma.user.update({
          where: { email: adminEmail },
          data: { role: 'ADMIN' }
        });
        console.log('✅ Updated existing user to ADMIN:', updated.email);
      } else {
        console.log('✅ User is already an ADMIN:', existingUser.email);
      }
    } else {
      console.log('ℹ️  User does not exist in database yet.');
      console.log('    User will be created when you first log in through the app.');
      console.log('    After logging in, run this script again to grant admin access.');
    }

    // Show all users
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('\n📊 Current users in database:');
    if (allUsers.length === 0) {
      console.log('   No users found in database');
    } else {
      allUsers.forEach(user => {
        console.log(`   ${user.email} - ${user.role} - ${user.name || '(no name)'}`);
      });
      console.log(`   Total: ${allUsers.length} users`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

ensureAdmin();