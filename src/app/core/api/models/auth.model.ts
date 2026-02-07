export type Resource = 'contacts' | 'users' | 'roles' | 'permissions' | 'tickets';
export type Action = 'create' | 'read' | 'update' | 'delete';
export type Permission = `${Resource}:${Action}`;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  permissions: Permission[];
  iat: number;
  exp: number;
}
