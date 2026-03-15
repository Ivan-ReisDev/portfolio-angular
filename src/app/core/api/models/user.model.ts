export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  roleId: string;
  phone?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  roleId?: string;
  phone?: string;
}
