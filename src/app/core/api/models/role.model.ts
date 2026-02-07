import { PermissionEntity } from './permission.model';

export interface Role {
  id: string;
  name: string;
  permissions: PermissionEntity[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRolePayload {
  name: string;
  permissionIds: string[];
}

export interface UpdateRolePayload {
  name?: string;
  permissionIds?: string[];
}
