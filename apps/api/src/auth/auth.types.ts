export interface AuthJwtPayload {
  sub: string;
  email: string;
  rol: 'ADMIN';
}

export interface RequestConUsuario {
  user: AuthJwtPayload;
}
