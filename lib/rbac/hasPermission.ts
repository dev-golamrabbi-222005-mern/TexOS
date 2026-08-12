import connectDB from '../db/connect';
import UserRole from '../db/models/UserRole';
import RolePermission from '../db/models/RolePermission';
import Permission from '../db/models/Permission';
import User from '../db/models/User';
import mongoose from 'mongoose';

/**
 * Checks if a given user has the specified permission for a module and action.
 * Traverses: User -> UserRole -> RolePermission -> Permission.
 *
 * @param userId - The ID of the user to check
 * @param module - The module name (e.g., 'Complaint', 'Bundle', 'QC', 'Factory', 'Reports')
 * @param action - The action name (e.g., 'create', 'read', 'update', 'delete', 'manage')
 * @returns Promise<boolean> - True if user has permission, false otherwise
 */
export async function hasPermission(
  userId: string | mongoose.Types.ObjectId,
  module: string,
  action: string
): Promise<boolean> {
  if (!userId) return false;

  await connectDB();

  // SuperAdmin override check
  const user = await User.findById(userId);
  if (user && user.userType === 'SuperAdmin') {
    return true;
  }

  // 1. Get active UserRoles for the user
  const userRoles = await UserRole.find({
    userId,
    status: 'Active',
  }).select('roleId');

  if (!userRoles.length) {
    return false;
  }

  const roleIds = userRoles.map((ur) => ur.roleId);

  // 2. Get RolePermissions for all user roles
  const rolePermissions = await RolePermission.find({
    roleId: { $in: roleIds },
  }).select('permissionId');

  if (!rolePermissions.length) {
    return false;
  }

  const permissionIds = rolePermissions.map((rp) => rp.permissionId);

  // 3. Find matching Permission for module and action (or 'manage' action which covers all actions)
  const permissionCount = await Permission.countDocuments({
    _id: { $in: permissionIds },
    module: module,
    action: { $in: [action, 'manage'] },
  } as Record<string, any>);

  return permissionCount > 0;
}

export default hasPermission;
