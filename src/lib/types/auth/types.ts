export interface SignInFormData {
  email: string;
  password: string;
}

export interface Token {
  id: number | string;
  name: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  tokenExpires: number | string;
}
