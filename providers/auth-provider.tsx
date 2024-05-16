import { getUserDetails } from "@/app/dashboard/_actions/actions";
import { useUser } from "@clerk/nextjs";
import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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
          setError("No user details found");
          return;
        }

        setUserDetails(response);
      } catch (error) {
        setError("Error fetching user details");
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  return (
    <AuthContext.Provider value={{ userDetails, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
