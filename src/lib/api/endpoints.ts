export const BFF_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
  },
  invoices: {
    root: "/api/invoices",
  },
} as const;

export const EXTERNAL_PATHS = {
  membership: {
    me: "/membership-service/1.0.0/users/me",
  },
  invoices: {
    root: "/invoice-service/1.0.0/invoices",
  },
} as const;

export const APP_ROUTES = {
  home: "/",
  login: "/login",
  invoices: "/invoices",
  createInvoice: "/invoices/create",
} as const;

export const PUBLIC_PATHS = [
  APP_ROUTES.login,
  BFF_ENDPOINTS.auth.login,
] as const;
