import { Resource, Action } from './auth.model';

export interface PermissionEntity {
  id: string;
  resource: Resource;
  action: Action;
}
