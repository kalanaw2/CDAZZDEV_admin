"use client";
import useLogout from "@/hooks/logout";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'
import { useEffect } from "react";

const AuthGuard = ({ children }) => {
  const { logout } = useLogout();
  const router = useRouter();
  const pathname = usePathname()

  useEffect(() => {

    if (!window.localStorage.getItem("token")) {
        if (pathname == '/login' || pathname == '/register') {
            return
          } else {
            router.replace('/login')
          }
      logout();
      router.replace("/login");
    }

  }, [router]);
  
  return <>{children}</>;
};

export default AuthGuard;
