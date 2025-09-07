#!/usr/bin/env bun

import { PrismaClient } from '@prisma/client';

async function testConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('🔍 Testing database connection...\n');
    
    // Simple query to test connection
    const userCount = await prisma.user.count();
    console.log(`✅ Connection successful! Found ${userCount} users in database.\n`);

    // Check for specific user
    const adminEmail = 'jeffreyverlynjohnson@gmail.com';
    const admin = await prisma.user.findFirst({
      where: { email: adminEmail }
    });

    if (admin) {
      console.log(`📧 User ${adminEmail}:`);
      console.log(`   - ID: ${admin.id}`);
      console.log(`   - Name: ${admin.name || '(not set)'}`);
      console.log(`   - Role: ${admin.role}`);
      console.log(`   - Created: ${admin.createdAt}`);
    } else {
      console.log(`❌ User ${adminEmail} not found in database`);
    }

  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();