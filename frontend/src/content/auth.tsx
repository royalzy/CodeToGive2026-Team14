import type React from "react";
import { useState } from "react";
import type { FamilyAccount } from "../content/types";
import { demoFamilies } from "../content/en";
import { AuthContext } from "../content/authContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [family, setFamily] = useState<FamilyAccount | null>(null);

  function login(familyId: string) {
    const found = demoFamilies.find((f) => f.id === familyId);
    if (found) setFamily(found);
  }

  function logout() {
    setFamily(null);
  }

  return (
    <AuthContext.Provider value={{ family, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
