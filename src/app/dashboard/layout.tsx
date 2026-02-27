import { ReactNode } from "react";
import {
    LayoutDashboard,
    FileText,
    Settings,
    BarChart2,
    HelpCircle,
    LogOut,
    Bell,
    Search,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: "Overview", href: "/dashboard", active: true },
        { icon: <FileText size={20} />, label: "Posts", href: "/dashboard/posts" },
        { icon: <BarChart2 size={20} />, label: "Analytics", href: "/dashboard/analytics" },
        { icon: <Settings size={20} />, label: "Settings", href: "/dashboard/settings" },
    ];

    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-zinc-100 flex flex-col p-6 space-y-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="h-10 w-10 bg-[var(--hero)] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        S
                    </div>
                    <span className="font-extrabold text-xl text-[var(--foreground)] tracking-tight">ShipInPublic</span>
                </div>

                <div className="flex-1 space-y-1">
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${item.active
                                    ? "bg-[var(--hero)] text-white shadow-lg shadow-[var(--hero)]/20"
                                    : "text-zinc-500 hover:bg-zinc-50 hover:text-[var(--foreground)]"
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </a>
                    ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-zinc-100">
                    <a className="flex items-center gap-3 px-4 py-3 font-bold text-zinc-500 hover:text-[var(--foreground)] transition-colors">
                        <HelpCircle size={20} /> Help & Docs
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 font-bold text-zinc-500 hover:text-[var(--foreground)] transition-colors">
                        <LogOut size={20} /> Sign Out
                    </a>

                    <div className="bg-zinc-50 rounded-2xl p-4 mt-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 rounded-full bg-[var(--primary)]"></div>
                            <div>
                                <div className="text-xs font-bold text-[var(--foreground)]">Pro Plan</div>
                                <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Active</div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-100 flex items-center justify-between px-10 shrink-0">
                    <div className="flex items-center bg-zinc-100 rounded-2xl px-4 h-12 w-96 border border-zinc-200/50">
                        <Search size={18} className="text-zinc-400" />
                        <input className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full ml-3 placeholder:text-zinc-400" placeholder="Search activity, posts..." />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12 hover:bg-zinc-100">
                            <Bell size={20} className="text-zinc-500" />
                        </Button>
                        <Button className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 font-bold h-12 px-6 rounded-xl border-none">
                            <Plus size={20} className="mr-2" /> New Post
                        </Button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
