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
  setDemoUser: (demoUser: AppUser) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setDemoUser: () => {},
});

// Demo users for testing (stored in localStorage with special prefix to identify them)
const DEMO_USERS: Record<string, AppUser> = {
  "student@campusflow.edu": {
    uid: "demo-student-001",
    email: "student@campusflow.edu",
    displayName: "Rituraj",
    role: "student",
  },
  "faculty@campusflow.edu": {
    uid: "demo-faculty-001",
    email: "faculty@campusflow.edu",
    displayName: "Dr. Smith",
    role: "faculty",
  },
  "admin@campusflow.edu": {
    uid: "demo-admin-001",
    email: "admin@campusflow.edu",
    displayName: "Admin",
    role: "admin",
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const setDemoUser = (demoUser: AppUser) => {
    setUser(demoUser);
    // Store demo user in localStorage
    localStorage.setItem("__campus_demo_user", JSON.stringify(demoUser));
  };

  useEffect(() => {
    // Check if there's a demo user in localStorage first
    const demoUserJson = localStorage.getItem("__campus_demo_user");
    if (demoUserJson) {
      try {
        const demoUser = JSON.parse(demoUserJson);
        setUser(demoUser);
        setLoading(false);
        return; // Skip Firebase Auth check for demo
      } catch (e) {
        localStorage.removeItem("__campus_demo_user");
      }
    }

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
    <AuthContext.Provider value={{ user, loading, setDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export { DEMO_USERS };
