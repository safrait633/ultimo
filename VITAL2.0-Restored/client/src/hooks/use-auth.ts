import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, getAuthToken, setAuthToken, removeAuthToken, isAuthenticated } from "@/lib/auth";
import { LoginData, User } from "@shared/schema";
import { useToast } from "./use-toast";

export function useAuth() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/simple/me"],
    queryFn: authApi.getCurrentUser,
    enabled: isLoggedIn,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuthToken(data.token);
      setIsLoggedIn(true);
      queryClient.setQueryData(["/api/simple/me"], data.user);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.firstName} ${data.user.lastName}!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuthToken(data.token);
      setIsLoggedIn(true);
      queryClient.setQueryData(["/api/simple/me"], data.user);
      toast({
        title: "Registration Successful",
        description: `Welcome, ${data.user.firstName} ${data.user.lastName}!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
    },
  });

  const logout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
    queryClient.clear();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const login = (credentials: LoginData) => {
    loginMutation.mutate(credentials);
  };

  const register = (userData: any) => {
    registerMutation.mutate(userData);
  };

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  return {
    user,
    isLoading,
    isLoggedIn,
    login,
    register,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
}
