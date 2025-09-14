import { MedicalUserDB, type InsertMedicalUser } from "./medical-user-db";
import { createReplitDB } from "./replit-db-adapter";

// Seed medical users for testing the authentication system
export async function seedMedicalUsers() {
  const replitDB = createReplitDB();
  const medicalUserDB = new MedicalUserDB(replitDB);

  // Get deployment URL
  const deploymentUrl = process.env.REPLIT_DEV_DOMAIN 
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : 'localhost:5000';

  const testUsers: InsertMedicalUser[] = [
    {
      email: "dr.johnson@hospital.com",
      password: "Password123!",
      nombres: "Sarah",
      apellidos: "Johnson",
      role: "medico",
      specialty: "Cardiología",
      licenseNumber: "CG12345",
      hospitalId: "HOSP001",
      isActive: true,
      isVerified: true,
      ultimoAcceso: null,
      preferencias: {
        idioma: "es",
        tema: "light",
        notificaciones: true
      },
      replitMetadata: {
        deploymentUrl,
        lastActiveSession: null
      }
    },
    {
      email: "admin@medicalsystem.com",
      password: "AdminSecure789!",
      nombres: "María",
      apellidos: "González",
      role: "super_admin",
      specialty: "Administración Médica",
      licenseNumber: "AD11111",
      hospitalId: null,
      isActive: true,
      isVerified: true,
      ultimoAcceso: null,
      preferencias: {
        idioma: "es",
        tema: "light",
        notificaciones: true
      },
      replitMetadata: {
        deploymentUrl,
        lastActiveSession: null
      }
    }
  ];

  try {
    console.log('🏥 Seeding medical users...');
    
    for (const userData of testUsers) {
      try {
        // Check if user already exists
        const existingUser = await medicalUserDB.findUserByEmail(userData.email);
        if (existingUser) {
          console.log(`✓ User ${userData.email} already exists`);
          continue;
        }

        const user = await medicalUserDB.createUser(userData);
        console.log(`✓ Created medical user: ${user.nombres} ${user.apellidos} (${user.email})`);
      } catch (error) {
        console.error(`✗ Failed to create user ${userData.email}:`, error instanceof Error ? error.message : error);
      }
    }

    // Get user statistics
    const stats = await medicalUserDB.getUserStats();
    console.log('\n📊 Medical user statistics:');
    console.log(`   Total users: ${stats.total}`);
    console.log(`   Active users: ${stats.active}`);
    console.log(`   Verified users: ${stats.verified}`);
    console.log(`   Doctors: ${stats.medicos}`);
    console.log(`   Super admins: ${stats.superAdmins}`);
    
    console.log('\n🔑 Test credentials:');
    console.log('   Email: dr.johnson@hospital.com');
    console.log('   Password: Password123!');
    console.log('\n🏥 Medical authentication system ready!');

  } catch (error) {
    console.error('Failed to seed medical users:', error);
  }
}