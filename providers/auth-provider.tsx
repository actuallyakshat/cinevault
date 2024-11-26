"use client";
import LoadingScreen from "@/app/_components/LoadingScreen";
import { getUserDetails } from "@/app/dashboard/_actions/actions";
import { UserDetailsWithLists } from "@/types/user";
import { useClerk, useUser } from "@clerk/nextjs";
import React, { createContext, useEffect, useState } from "react";

interface AuthContextProps {
  userDetails: UserDetailsWithLists | undefined;
  setUserDetails: React.Dispatch<
    React.SetStateAction<UserDetailsWithLists | undefined>
  >;
  loading: boolean;
  refreshUserDetails: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const { loaded } = useClerk();
  const [loading, setLoading] = useState<boolean>(true);
  const [userDetails, setUserDetails] = useState<
    UserDetailsWithLists | undefined
  >();

  const refreshUserDetails = async () => {
    if (!userDetails || !user) return;
    const freshUserDetails = await getUserDetails({
      email: userDetails.email,
      name: userDetails.name,
      clerkId: user!.id,
    });
    if (freshUserDetails) {
      setUserDetails(freshUserDetails);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        if (!user) return;

        const response = await getUserDetails({
          name: user.fullName!,
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress!,
        });

        if (!response) {
          return;
        }

        setUserDetails(response);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUserDetails();
    setLoading(false);
  }, [user]);

  if (loading || !loaded) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider
      value={{ userDetails, setUserDetails, loading, refreshUserDetails }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
