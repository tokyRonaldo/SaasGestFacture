'use client'

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: ReactNode;
};

export default function ProtectedPage({ children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push('/component/auth/login')
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return null;

  return <>{children}</>;
}