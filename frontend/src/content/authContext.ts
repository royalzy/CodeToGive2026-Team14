import { createContext } from "react";
import type { FamilyAccount } from "./types";

export interface AuthState {
  family: FamilyAccount | null;
  login: (familyId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthState | null>(null);
