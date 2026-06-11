'use client'

import { useRouter } from "next/navigation";
import Sidebar from "@/app/template/Sidebar";
import UserInfo from "@/app/template/UserInfo";
import ProtectedPage from "@/components/ProtectedPage";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push('/component/auth/login')
  }

  return (


    <ProtectedPage>


        <Sidebar />

        <header className="fixed top-0 right-0 w-[calc(100%-260px)] h-16 bg-surface border-b border-outline-variant flex justify-between items-center px-xl z-40">
        <div className="flex items-center gap-xl w-1/2">
        <button className="text-on-surface-variant hover:text-primary transition-colors relative">
        <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
        <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
        </button>

        </div>
        <div className="flex items-center gap-lg">

          <Dialog>
            <DialogTrigger asChild>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">
                  logout
                </span>
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Déconnexion</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir vous déconnecter ?
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="flex gap-2">
                <DialogClose asChild>
                  <button className="px-4 py-2 border rounded-md">
                    Annuler
                  </button>
                </DialogClose>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Se déconnecter
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="w-px h-8 bg-outline-variant mx-sm"></div>
          <div className="flex items-center gap-md">
          <img alt="User profile" className="w-8 h-8 rounded-full border border-outline-variant" data-alt="A professional headshot of a business owner in a clean office environment. The image is bright and crisp, featuring soft directional lighting that highlights the subject's friendly but authoritative demeanor. The overall aesthetic is corporate-modern with high contrast and a clean white background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7PWxZZN3sGjfmpvR3PszgQSQFSwVbdJN6Kr478N5G_KGywIUv2pWUQc3wKN0Udc6SMHPNAQ2L7RhAYeA8tXwmO9n7iKxRcZhdqR0sVe4TljmTlRhkHXX2cyuqqPdA7kpvo8B44z9Ie2wxCqPYnTWDXl459vLy-_9GOrki1b1hkDUGtkrR8Z8wtYpGOx3tdjcRnuRw8aWj4VcWQxegN9FmPIOxAmJIDwXbGw_Xa9IljGZOYAMatGIRrVxzeOsdQpaUgpZ3BiDmJLFu"/>
          <UserInfo />
          </div>
        </div>
        </header>
        <main className="ml-[260px] pt-16 min-h-screen p-xl">
            {children}
        </main>


    </ProtectedPage>
  )
}