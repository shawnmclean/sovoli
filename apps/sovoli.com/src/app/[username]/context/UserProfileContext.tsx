"use client";

import { createContext, useContext } from "react";

import type { UserProfile } from "~/services/users/getUserProfileByUsername";

export const UserProfileContext = createContext<UserProfile | null>(null);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
