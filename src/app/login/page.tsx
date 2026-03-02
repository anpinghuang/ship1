"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4 relative overflow-hidden">
            <div className="relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <SignIn
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "bg-white border border-[#E5E7EB] shadow-sm rounded-2xl",
                            headerTitle: "text-[#111111] text-xl font-bold",
                            headerSubtitle: "text-[#6B7280]",
                            socialButtonsBlockButton: "bg-white border border-[#E5E7EB] hover:bg-[#FAFAFA] text-[#111111]",
                            socialButtonsBlockButtonText: "text-[#111111] font-medium",
                            dividerLine: "bg-[#E5E7EB]",
                            dividerText: "text-[#9CA3AF]",
                            formFieldLabel: "text-[#111111]",
                            formFieldInput: "bg-white border-[#E5E7EB] text-[#111111] focus:border-[#111111] focus:ring-[#111111]/20",
                            formButtonPrimary: "bg-[#111111] hover:bg-[#333333] text-white font-medium border-none",
                            footerActionText: "text-[#6B7280]",
                            footerActionLink: "text-[#111111] hover:text-[#333333]",
                            footer: "bg-[#FAFAFA] border-t border-[#E5E7EB]",
                            identityPreviewText: "text-[#111111]",
                            identityPreviewEditButtonIcon: "text-[#111111]",
                            formFieldAction: "text-[#111111] hover:text-[#333333]",
                            alertText: "text-red-500"
                        }
                    }}
                    routing="hash"
                    fallbackRedirectUrl="/onboarding"
                />
            </div>
        </div>
    );
}
