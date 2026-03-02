"use client";

import Link from "next/link";
import { LayoutDashboard, Send, Workflow, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export function Sidebar({ user }: { user: { name?: string | null, email?: string | null } }) {
    const pathname = usePathname();

    const mainLinks = [
        { href: "/dashboard", label: "Home", icon: LayoutDashboard, exact: true },
        { href: "/dashboard/posts", label: "Posts", icon: Send, exact: false },
        { href: "/dashboard/rules", label: "Automation", icon: Workflow, exact: false },
        { href: "/dashboard/settings", label: "Settings", icon: Settings, exact: false },
    ];

    return (
        <aside className="w-64 bg-white border-r border-[#E5E7EB] hidden md:flex flex-col">
            {/* Top header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-[#E5E7EB]">
                <span className="font-bold text-lg tracking-tight text-[#111111]">
                    ShipInPublic
                </span>
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "w-9 h-9",
                            userButtonPopoverCard: "shadow-lg border border-[#E5E7EB]",
                        }
                    }}
                />
            </div>

            {/* Main nav links */}
            <nav className="flex-1 px-4 py-6 space-y-1.5">
                {mainLinks.map((link) => {
                    const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 ${isActive
                                ? "text-[#111111] bg-[#F3F4F6] shadow-sm"
                                : "text-[#6B7280] hover:text-[#111111] hover:bg-[#F3F4F6]"
                                }`}
                        >
                            <Icon size={20} strokeWidth={1.75} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

        </aside>
    );
}
