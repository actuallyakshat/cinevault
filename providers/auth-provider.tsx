"use client";
import { getUserDetails } from "@/app/dashboard/_actions/actions";
import { useUser } from "@clerk/nextjs";
import React, { createContext, useState, useEffect } from "react";
const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        console.log("user", user);
        if (!user) {
          return;
        }
        const response = await getUserDetails({
          name: user.fullName!,
          email: user.primaryEmailAddress?.emailAddress!,
        });
        if (!response) {
          console.log("No user details found");
          return;
        }
        setUserDetails(response);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user]);

  return (
    <AuthContext.Provider value={{ userDetails, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
