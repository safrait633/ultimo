import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

// Replit Database interface simulation (using Map for now since we're on Neon)
interface ReplitDB {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  list(prefix?: string): Promise<string[]>;
}

// Medical User interface with all required fields
export interface MedicalUser {
  id: string;
  email: string;
  passwordHash: string;
  nombres: string;
  apellidos: string;
  role: 'medico' | 'super_admin';
  specialty: string;
  licenseNumber: string;
  hospitalId: string | null;
  isActive: boolean;
  isVerified: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  ultimoAcceso: Date | null;
  preferencias: {
    idioma: string;
    tema: string;
    notificaciones: boolean;
  };
  replitMetadata: {
    deploymentUrl: string;
    lastActiveSession: string | null;
    replitUserId?: string;
  };
}

export type InsertMedicalUser = Omit<MedicalUser, 'id' | 'passwordHash' | 'fechaCreacion' | 'fechaActualizacion'> & {
  password: string;
};

// Medical User Database class using key-value pairs
export class MedicalUserDB {
  private db: ReplitDB;

  constructor(db: ReplitDB) {
    this.db = db;
  }

  // Create a new medical user
  async createUser(userData: InsertMedicalUser): Promise<MedicalUser> {
    const userId = randomUUID();
    
    // Check if email already exists
    const existingByEmail = await this.findUserByEmail(userData.email);
    if (existingByEmail) {
      throw new Error('El email ya está registrado en el sistema médico');
    }

    // Check if license number already exists
    const existingByLicense = await this.findUserByLicense(userData.licenseNumber);
    if (existingByLicense) {
      throw new Error('El número de licencia ya está registrado');
    }

    // Validate medical license format (simplified)
    if (!this.validateLicenseNumber(userData.licenseNumber)) {
      throw new Error('Formato de licencia médica inválido');
    }

    // Hash password with 12 rounds
    const passwordHash = await bcrypt.hash(userData.password, 12);
    
    const now = new Date();
    const user: MedicalUser = {
      id: userId,
      email: userData.email.toLowerCase(),
      passwordHash,
      nombres: userData.nombres.trim(),
      apellidos: userData.apellidos.trim(),
      role: userData.role,
      specialty: userData.specialty,
      licenseNumber: userData.licenseNumber.toUpperCase(),
      hospitalId: userData.hospitalId,
      isActive: userData.isActive,
      isVerified: userData.isVerified,
      fechaCreacion: now,
      fechaActualizacion: now,
      ultimoAcceso: userData.ultimoAcceso || null,
      preferencias: userData.preferencias,
      replitMetadata: userData.replitMetadata
    };

    // Store user data with multiple keys for efficient lookups
    await Promise.all([
      // Primary user data
      this.db.set(`users:${userId}`, JSON.stringify(user)),
      // Email lookup index
      this.db.set(`users:email:${user.email}`, userId),
      // License lookup index  
      this.db.set(`licenses:${user.licenseNumber}`, userId),
      // Role index for admin queries
      this.db.set(`users:role:${user.role}:${userId}`, '1'),
      // Hospital index if applicable
      ...(user.hospitalId ? [this.db.set(`users:hospital:${user.hospitalId}:${userId}`, '1')] : []),
      // Active users index
      ...(user.isActive ? [this.db.set(`users:active:${userId}`, '1')] : [])
    ]);

    return user;
  }

  // Find user by ID
  async findUserById(userId: string): Promise<MedicalUser | null> {
    try {
      const userData = await this.db.get(`users:${userId}`);
      if (!userData) return null;
      
      const user = JSON.parse(userData) as MedicalUser;
      // Convert date strings back to Date objects
      user.fechaCreacion = new Date(user.fechaCreacion);
      user.fechaActualizacion = new Date(user.fechaActualizacion);
      if (user.ultimoAcceso) user.ultimoAcceso = new Date(user.ultimoAcceso);
      
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  // Find user by email
  async findUserByEmail(email: string): Promise<MedicalUser | null> {
    try {
      const normalizedEmail = email.toLowerCase();
      const userId = await this.db.get(`users:email:${normalizedEmail}`);
      if (!userId) return null;
      
      return this.findUserById(userId);
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  // Find user by license number
  async findUserByLicense(licenseNumber: string): Promise<MedicalUser | null> {
    try {
      const normalizedLicense = licenseNumber.toUpperCase();
      const userId = await this.db.get(`licenses:${normalizedLicense}`);
      if (!userId) return null;
      
      return this.findUserById(userId);
    } catch (error) {
      console.error('Error finding user by license:', error);
      return null;
    }
  }

  // Update user data
  async updateUser(userId: string, updates: Partial<MedicalUser>): Promise<MedicalUser | null> {
    const user = await this.findUserById(userId);
    if (!user) return null;

    // Check if email is being changed and if new email exists
    if (updates.email && updates.email !== user.email) {
      const existingByEmail = await this.findUserByEmail(updates.email);
      if (existingByEmail && existingByEmail.id !== userId) {
        throw new Error('El nuevo email ya está en uso');
      }
    }

    // Check if license is being changed and if new license exists
    if (updates.licenseNumber && updates.licenseNumber !== user.licenseNumber) {
      const existingByLicense = await this.findUserByLicense(updates.licenseNumber);
      if (existingByLicense && existingByLicense.id !== userId) {
        throw new Error('El nuevo número de licencia ya está en uso');
      }
    }

    const updatedUser: MedicalUser = {
      ...user,
      ...updates,
      id: user.id, // Ensure ID cannot be changed
      fechaActualizacion: new Date()
    };

    // Update all relevant indexes if needed
    const updatePromises = [
      this.db.set(`users:${userId}`, JSON.stringify(updatedUser))
    ];

    // Update email index if email changed
    if (updates.email && updates.email !== user.email) {
      updatePromises.push(
        this.db.delete(`users:email:${user.email}`),
        this.db.set(`users:email:${updates.email.toLowerCase()}`, userId)
      );
    }

    // Update license index if license changed
    if (updates.licenseNumber && updates.licenseNumber !== user.licenseNumber) {
      updatePromises.push(
        this.db.delete(`licenses:${user.licenseNumber}`),
        this.db.set(`licenses:${updates.licenseNumber.toUpperCase()}`, userId)
      );
    }

    // Update role index if role changed
    if (updates.role && updates.role !== user.role) {
      updatePromises.push(
        this.db.delete(`users:role:${user.role}:${userId}`),
        this.db.set(`users:role:${updates.role}:${userId}`, '1')
      );
    }

    // Update active index if status changed
    if (updates.isActive !== undefined && updates.isActive !== user.isActive) {
      if (updates.isActive) {
        updatePromises.push(this.db.set(`users:active:${userId}`, '1'));
      } else {
        updatePromises.push(this.db.delete(`users:active:${userId}`));
      }
    }

    await Promise.all(updatePromises);
    return updatedUser;
  }

  // Update last login time
  async updateLastLogin(userId: string, sessionId: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (!user) return;

    const updatedUser = {
      ...user,
      ultimoAcceso: new Date(),
      replitMetadata: {
        ...user.replitMetadata,
        lastActiveSession: sessionId
      },
      fechaActualizacion: new Date()
    };

    await this.db.set(`users:${userId}`, JSON.stringify(updatedUser));
  }

  // Verify password
  async verifyPassword(email: string, password: string): Promise<MedicalUser | null> {
    const user = await this.findUserByEmail(email);
    if (!user || !user.isActive) return null;

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    return isValidPassword ? user : null;
  }

  // Get users by role
  async getUsersByRole(role: 'medico' | 'super_admin'): Promise<MedicalUser[]> {
    try {
      const userKeys = await this.db.list(`users:role:${role}:`);
      const userIds = userKeys.map(key => key.split(':').pop()).filter(Boolean);
      
      const users = await Promise.all(
        userIds.map(id => this.findUserById(id!))
      );
      
      return users.filter(user => user !== null) as MedicalUser[];
    } catch (error) {
      console.error('Error getting users by role:', error);
      return [];
    }
  }

  // Get active users
  async getActiveUsers(): Promise<MedicalUser[]> {
    try {
      const activeKeys = await this.db.list('users:active:');
      const userIds = activeKeys.map(key => key.split(':').pop()).filter(Boolean);
      
      const users = await Promise.all(
        userIds.map(id => this.findUserById(id!))
      );
      
      return users.filter(user => user !== null) as MedicalUser[];
    } catch (error) {
      console.error('Error getting active users:', error);
      return [];
    }
  }

  // Validate medical license number format
  private validateLicenseNumber(license: string): boolean {
    // Basic validation - can be enhanced based on country/region requirements
    // Example: CG12345, MD123456, etc.
    const licensePattern = /^[A-Z]{2,3}\d{4,8}$/;
    return licensePattern.test(license.toUpperCase());
  }

  // Clean up inactive users (for maintenance)
  async cleanupInactiveUsers(daysSinceLastLogin: number = 365): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastLogin);
    
    const allKeys = await this.db.list('users:');
    const userIds = allKeys
      .filter(key => key.startsWith('users:') && !key.includes(':'))
      .map(key => key.replace('users:', ''));

    let cleanedCount = 0;
    
    for (const userId of userIds) {
      const user = await this.findUserById(userId);
      if (user && user.ultimoAcceso && user.ultimoAcceso < cutoffDate && !user.isActive) {
        await this.deleteUser(userId);
        cleanedCount++;
      }
    }
    
    return cleanedCount;
  }

  // Delete user and all associated indexes
  private async deleteUser(userId: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (!user) return;

    await Promise.all([
      this.db.delete(`users:${userId}`),
      this.db.delete(`users:email:${user.email}`),
      this.db.delete(`licenses:${user.licenseNumber}`),
      this.db.delete(`users:role:${user.role}:${userId}`),
      ...(user.hospitalId ? [this.db.delete(`users:hospital:${user.hospitalId}:${userId}`)] : []),
      this.db.delete(`users:active:${userId}`)
    ]);
  }

  // Get user statistics
  async getUserStats(): Promise<{
    total: number;
    active: number;
    verified: number;
    medicos: number;
    superAdmins: number;
  }> {
    const [active, medicos, superAdmins] = await Promise.all([
      this.getActiveUsers(),
      this.getUsersByRole('medico'),
      this.getUsersByRole('super_admin')
    ]);

    const allUsers = [...medicos, ...superAdmins];
    const verified = allUsers.filter(user => user.isVerified).length;

    return {
      total: allUsers.length,
      active: active.length,
      verified,
      medicos: medicos.length,
      superAdmins: superAdmins.length
    };
  }
}