"use client";
import LoadingScreen from "@/app/_components/LoadingScreen";
import { getUserDetails } from "@/app/dashboard/_actions/actions";
import { useUser } from "@clerk/nextjs";
import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        if (!user) return;

        const response = await getUserDetails({
          name: user.fullName!,
          email: user.primaryEmailAddress?.emailAddress!,
        });

        if (!response) {
          return;
        }

        setUserDetails(response);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [user]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ userDetails, setUserDetails, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
