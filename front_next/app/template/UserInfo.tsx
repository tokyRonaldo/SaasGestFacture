'use client'

import { useEffect, useState } from 'react';

export default function UserInfo() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    console.log('iciiiiiiiii')
    const storedUser = localStorage.getItem('user');
    console.log(storedUser)
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="hidden lg:block">
      <p className="font-label-sm text-label-sm text-on-surface font-bold">
        {user?.name || user?.companyName || 'USER'}
      </p>
      <p className="font-label-sm text-[10px] text-secondary">
        Administrateur
      </p>
    </div>
  );
}