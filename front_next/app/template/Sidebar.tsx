'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar(){
    const pathname = usePathname();
    const menus = [
        {
            label: "Dashboard",
            href: "/component/project/dashboard",
            icon: "dashboard",
        },
        {
            label: "Clients",
            href: "/component/project/client",
            icon: "group",
        },
        {
            label: "Quotes",
            href: "/component/project/quote/index",
            icon: "description",
        },
        {
            label: "Invoices",
            href: "/component/project/invoice",
            icon: "receipt_long",
        },
        {
            label: "Settings",
            href: "/component/project/settings",
            icon: "settings",
        },
    ];
    return(
        <aside className="w-[260px] h-screen fixed left-0 top-0 bg-surface border-r border-outline-variant flex flex-col py-lg px-md z-50">
        <div className="mb-xl px-sm">
        <h1 className="font-h2 text-h2 text-primary">Gestion S.A.</h1>
        <p className="font-body-md text-body-md text-secondary">Finance Manager</p>
        </div>

        <nav className="flex-1 space-y-xs">

            {menus.map((menu) => {

               const active =
                    menu.href === "/component/project/quote/index"
                        ? pathname.startsWith("/component/project/quote")
                        : pathname === menu.href;

                return (
                    <Link
                        key={menu.href}
                        href={menu.href}
                        className={`flex items-center gap-md p-md rounded-lg transition-colors duration-150
                        ${
                            active
                                ? "text-primary font-bold border-r-4 border-primary bg-primary-container/10"
                                : "text-secondary hover:bg-surface-container-high"
                        }`}
                    >
                        <span className="material-symbols-outlined">
                            {menu.icon}
                        </span>

                        <span className="font-body-md text-body-md">
                            {menu.label}
                        </span>
                    </Link>
                );
            })}

        </nav>


        </aside>
    )
}