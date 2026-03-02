import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { PageTransition } from "@/components/page-transition";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await currentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex h-screen bg-white text-[#111111] overflow-hidden">
            <Sidebar user={{ name: user.fullName || user.username, email: user.emailAddresses[0]?.emailAddress }} />

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto bg-[#FAFAFA]">
                <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </div>
            </main>
        </div>
    );
}
