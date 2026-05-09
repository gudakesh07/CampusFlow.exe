import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: "student" | "faculty" | "admin" | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch or create user record
        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        
        let appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: null,
        };

        if (userDoc.exists()) {
          appUser.role = userDoc.data().role as AppUser["role"];
        } else {
          // Temporarily set a default role for demo purposes.
          // In a real app, role would be verified via custom claims or admin dashboard.
          // Let's deduce role from some mock logic or keep it null.
          // For now, let's just make everyone a 'student' by default to simplify.
          appUser.role = "student"; 
          await setDoc(userRef, {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: appUser.role,
            createdAt: new Date().toISOString(),
          });
        }
        
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
        {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
