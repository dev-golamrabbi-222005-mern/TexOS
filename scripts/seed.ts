import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';

// Fix for Windows DNS resolution for MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore DNS config fallback errors
}

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Inline schemas for standalone seed script execution
const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: String,
    userType: {
      type: String,
      enum: ['Worker', 'LineSupervisor', 'QCInspector', 'HRManager', 'FactoryAdmin', 'SuperAdmin'],
      required: true,
    },
    factoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Factory' },
    status: { type: String, default: 'Active' },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const FactorySchema = new mongoose.Schema(
  {
    factoryCode: { type: String, required: true, unique: true },
    factoryName: { type: String, required: true },
    address: { type: String, required: true },
    division: String,
    district: String,
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'Active' },
  },
  { timestamps: true }
);

const FactoryLineSchema = new mongoose.Schema(
  {
    factoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Factory', required: true },
    lineName: { type: String, required: true },
    lineType: String,
    status: { type: String, default: 'Active' },
  },
  { timestamps: true }
);

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    roleType: { type: String, default: 'Custom' },
    status: { type: String, default: 'Active' },
  },
  { timestamps: true }
);

const PermissionSchema = new mongoose.Schema(
  {
    module: { type: String, required: true },
    permissionName: { type: String, required: true },
    action: { type: String, required: true },
  },
  { timestamps: true }
);

const RolePermissionSchema = new mongoose.Schema(
  {
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    permissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Permission', required: true },
  },
  { timestamps: true }
);

const UserRoleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    assignedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Active' },
  },
  { timestamps: true }
);

const WorkerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    workerCode: { type: String, required: true, unique: true },
    status: { type: String, default: 'Active' },
    joiningDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const WorkerProfileSchema = new mongoose.Schema(
  {
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true, unique: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    gender: String,
    emergencyContact: String,
  },
  { timestamps: true }
);

const WorkerFactoryAssignmentSchema = new mongoose.Schema(
  {
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    factoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Factory', required: true },
    lineId: { type: mongoose.Schema.Types.ObjectId, ref: 'FactoryLine' },
    designation: String,
    assignedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Active' },
  },
  { timestamps: true }
);

const FactoryEmployeeSchema = new mongoose.Schema(
  {
    factoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Factory', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    designation: String,
    joiningDate: { type: Date, default: Date.now },
    status: { type: String, default: 'Active' },
  },
  { timestamps: true }
);

const UserOTPSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    phone: { type: String, required: true },
    otpCode: { type: String, required: true },
    purpose: { type: String, default: 'login' },
    expiresAt: { type: Date, required: true },
    status: { type: String, default: 'Pending' },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Factory = mongoose.models.Factory || mongoose.model('Factory', FactorySchema);
const FactoryLine = mongoose.models.FactoryLine || mongoose.model('FactoryLine', FactoryLineSchema);
const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);
const Permission = mongoose.models.Permission || mongoose.model('Permission', PermissionSchema);
const RolePermission = mongoose.models.RolePermission || mongoose.model('RolePermission', RolePermissionSchema);
const UserRole = mongoose.models.UserRole || mongoose.model('UserRole', UserRoleSchema);
const Worker = mongoose.models.Worker || mongoose.model('Worker', WorkerSchema);
const WorkerProfile = mongoose.models.WorkerProfile || mongoose.model('WorkerProfile', WorkerProfileSchema);
const WorkerFactoryAssignment =
  mongoose.models.WorkerFactoryAssignment || mongoose.model('WorkerFactoryAssignment', WorkerFactoryAssignmentSchema);
const FactoryEmployee = mongoose.models.FactoryEmployee || mongoose.model('FactoryEmployee', FactoryEmployeeSchema);
const UserOTP = mongoose.models.UserOTP || mongoose.model('UserOTP', UserOTPSchema);

async function seed() {
  console.log('🌱 Starting TexOS Database Seeding...');
  await mongoose.connect(MONGODB_URI!);

  // Clean existing collections
  await Promise.all([
    User.deleteMany({}),
    Factory.deleteMany({}),
    FactoryLine.deleteMany({}),
    Role.deleteMany({}),
    Permission.deleteMany({}),
    RolePermission.deleteMany({}),
    UserRole.deleteMany({}),
    Worker.deleteMany({}),
    WorkerProfile.deleteMany({}),
    WorkerFactoryAssignment.deleteMany({}),
    FactoryEmployee.deleteMany({}),
    UserOTP.deleteMany({}),
  ]);

  console.log('🧹 Cleaned previous database collections.');

  // 1. Create Factory
  const factory = await Factory.create({
    factoryCode: 'FAC-001',
    factoryName: 'Apex RMG Garments Ltd.',
    address: 'Plot 14, Sector 7, Uttara, Dhaka',
    division: 'Dhaka',
    district: 'Dhaka',
    status: 'Active',
  });
  console.log(`✅ Created Factory: ${factory.factoryName} (ID: ${factory._id})`);

  // 2. Create FactoryLines (2 lines)
  const lineA = await FactoryLine.create({
    factoryId: factory._id,
    lineName: 'Line A - Cutting & Sewing',
    lineType: 'Sewing',
    status: 'Active',
  });

  const lineB = await FactoryLine.create({
    factoryId: factory._id,
    lineName: 'Line B - QC & Packaging',
    lineType: 'Finishing',
    status: 'Active',
  });
  console.log(`✅ Created Factory Lines: ${lineA.lineName}, ${lineB.lineName}`);

  // 3. Create Permissions
  const permissionsList = [
    { module: 'Complaint', permissionName: 'complaint:read', action: 'read' },
    { module: 'Complaint', permissionName: 'complaint:create', action: 'create' },
    { module: 'Complaint', permissionName: 'complaint:update', action: 'update' },
    { module: 'Complaint', permissionName: 'complaint:manage', action: 'manage' },
    { module: 'Bundle', permissionName: 'bundle:read', action: 'read' },
    { module: 'Bundle', permissionName: 'bundle:create', action: 'create' },
    { module: 'Bundle', permissionName: 'bundle:update', action: 'update' },
    { module: 'Bundle', permissionName: 'bundle:manage', action: 'manage' },
    { module: 'QC', permissionName: 'qc:read', action: 'read' },
    { module: 'QC', permissionName: 'qc:create', action: 'create' },
    { module: 'QC', permissionName: 'qc:update', action: 'update' },
    { module: 'QC', permissionName: 'qc:manage', action: 'manage' },
    { module: 'Factory', permissionName: 'factory:read', action: 'read' },
    { module: 'Factory', permissionName: 'factory:manage', action: 'manage' },
    { module: 'Reports', permissionName: 'reports:read', action: 'read' },
    { module: 'Reports', permissionName: 'reports:manage', action: 'manage' },
  ];
  const permissions = await Permission.insertMany(permissionsList);
  console.log(`✅ Created ${permissions.length} Permissions`);

  const permMap = new Map(permissions.map((p) => [p.permissionName, p._id]));

  // 4. Create Roles & RolePermissions
  const rolesData = [
    {
      name: 'SuperAdmin',
      displayName: 'Super Administrator',
      perms: permissions.map((p) => p._id),
    },
    {
      name: 'FactoryAdmin',
      displayName: 'Factory Administrator',
      perms: permissions.map((p) => p._id),
    },
    {
      name: 'HRManager',
      displayName: 'HR Manager',
      perms: [
        permMap.get('complaint:read'),
        permMap.get('complaint:update'),
        permMap.get('complaint:manage'),
        permMap.get('factory:read'),
        permMap.get('reports:read'),
      ],
    },
    {
      name: 'QCInspector',
      displayName: 'Quality Inspector',
      perms: [
        permMap.get('qc:read'),
        permMap.get('qc:create'),
        permMap.get('qc:update'),
        permMap.get('bundle:read'),
      ],
    },
    {
      name: 'LineSupervisor',
      displayName: 'Line Supervisor',
      perms: [
        permMap.get('bundle:read'),
        permMap.get('bundle:create'),
        permMap.get('bundle:update'),
        permMap.get('qc:read'),
      ],
    },
    {
      name: 'Worker',
      displayName: 'RMG Worker',
      perms: [permMap.get('complaint:read'), permMap.get('complaint:create')],
    },
  ];

  const roleMap = new Map();
  for (const rData of rolesData) {
    const role = await Role.create({
      name: rData.name,
      displayName: rData.displayName,
      status: 'Active',
    });
    roleMap.set(rData.name, role._id);

    const rolePerms = rData.perms
      .filter((pId) => pId != null)
      .map((pId) => ({ roleId: role._id, permissionId: pId }));
    await RolePermission.insertMany(rolePerms);
  }
  console.log(`✅ Created ${rolesData.length} Roles & RolePermissions`);

  // 5. Create Users (1 FactoryAdmin, 1 HRManager, 1 LineSupervisor, 1 QCInspector, 2 Workers, 1 SuperAdmin)
  const usersData = [
    {
      fullName: 'System SuperAdmin',
      phone: '+8801700000000',
      userType: 'SuperAdmin',
      roleName: 'SuperAdmin',
    },
    {
      fullName: 'Rahim Chowdhury',
      phone: '+8801700000001',
      userType: 'FactoryAdmin',
      factoryId: factory._id,
      roleName: 'FactoryAdmin',
      designation: 'Factory Manager',
    },
    {
      fullName: 'Fatema Khatun',
      phone: '+8801700000002',
      userType: 'HRManager',
      factoryId: factory._id,
      roleName: 'HRManager',
      designation: 'Head of HR',
    },
    {
      fullName: 'Kabir Hossain',
      phone: '+8801700000003',
      userType: 'LineSupervisor',
      factoryId: factory._id,
      roleName: 'LineSupervisor',
      designation: 'Supervisor Line A',
    },
    {
      fullName: 'Nusrat Jahan',
      phone: '+8801700000004',
      userType: 'QCInspector',
      factoryId: factory._id,
      roleName: 'QCInspector',
      designation: 'Senior QC Inspector',
    },
    {
      fullName: 'Abul Kalam',
      phone: '+8801700000005',
      userType: 'Worker',
      factoryId: factory._id,
      roleName: 'Worker',
      workerCode: 'WRK-1001',
      lineId: lineA._id,
      gender: 'Male',
    },
    {
      fullName: 'Rina Akter',
      phone: '+8801700000006',
      userType: 'Worker',
      factoryId: factory._id,
      roleName: 'Worker',
      workerCode: 'WRK-1002',
      lineId: lineB._id,
      gender: 'Female',
    },
  ];

  for (const uData of usersData) {
    const user = await User.create({
      fullName: uData.fullName,
      phone: uData.phone,
      userType: uData.userType,
      factoryId: uData.factoryId,
      status: 'Active',
      isVerified: true,
    });

    // Assign Role
    const roleId = roleMap.get(uData.roleName);
    if (roleId) {
      await UserRole.create({
        userId: user._id,
        roleId,
        status: 'Active',
      });
    }

    // Set Factory Admin ID if FactoryAdmin
    if (uData.userType === 'FactoryAdmin') {
      factory.adminId = user._id;
      await factory.save();
    }

    // Create FactoryEmployee if non-Worker & non-SuperAdmin
    if (uData.factoryId && uData.userType !== 'Worker') {
      await FactoryEmployee.create({
        factoryId: uData.factoryId,
        userId: user._id,
        designation: uData.designation || uData.userType,
        status: 'Active',
      });
    }

    // Create Worker profile and assignment if Worker
    if (uData.userType === 'Worker') {
      const worker = await Worker.create({
        userId: user._id,
        workerCode: uData.workerCode,
        status: 'Active',
      });

      await WorkerProfile.create({
        workerId: worker._id,
        fullName: user.fullName,
        phone: user.phone,
        gender: uData.gender,
        emergencyContact: '+8801711111111',
      });

      await WorkerFactoryAssignment.create({
        workerId: worker._id,
        factoryId: factory._id,
        lineId: uData.lineId,
        designation: 'Sewing Machine Operator',
        status: 'Active',
      });
    }

    // Create active OTP for testing
    await UserOTP.create({
      userId: user._id,
      phone: user.phone,
      otpCode: '123456',
      purpose: 'login',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days valid for test
      status: 'Pending',
    });

    console.log(`👤 Created User: ${user.fullName} (${user.userType}) -> Phone: ${user.phone}`);
  }

  console.log('\n🎉 TexOS Database Seeding Completed Successfully!');
  console.log('----------------------------------------------------');
  console.log('Test Login Credentials (OTP: 123456 for all):');
  console.log(' - FactoryAdmin:   +8801700000001');
  console.log(' - HRManager:      +8801700000002');
  console.log(' - LineSupervisor: +8801700000003');
  console.log(' - QCInspector:    +8801700000004');
  console.log(' - Worker 1:       +8801700000005');
  console.log(' - Worker 2:       +8801700000006');
  console.log(' - SuperAdmin:     +8801700000000');
  console.log('----------------------------------------------------\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seeding Error:', err);
  process.exit(1);
});
