export type User = {
    id: string;
    username: string;
    role: Role;
};

export const ROLES = [
    "admin",
    "user",
] as const;

export type Role = typeof ROLES[number];