import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center py-24 relative overflow-hidden">
            <div className="text-center mb-16 relative z-10 px-6">
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-[0.2em] mb-3">Pricing</p>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#111111] mb-6">
                    Simple, transparent pricing
                </h1>
                <p className="text-[#6B7280] text-lg max-w-2xl mx-auto leading-relaxed">
                    Choose the perfect plan for you. No hidden fees.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-5xl mx-auto relative z-10 items-stretch">
                {/* Basic Plan */}
                <div className="flex flex-col rounded-2xl p-8 w-full border border-[#E5E7EB] bg-white hover:border-[#D1D5DB] transition-colors">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-[#111111] mb-2 leading-8">Beginner</span>
                        <span className="text-5xl font-bold text-[#111111] leading-none tracking-tight">Free</span>
                    </div>
                    <Link href="/login" className="w-full rounded-xl bg-white border-2 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white px-6 py-4 text-center font-semibold tracking-wide transition-colors text-base flex items-center justify-center gap-2 mt-6 mb-6">
                        Get Started <ArrowRight className="h-4 w-4" />
                    </Link>
                    <ul className="mb-2 flex-1 text-[#6B7280] space-y-3">
                        <li className="flex items-center text-sm">
                            <Check className="h-4 w-4 shrink-0 mr-3 text-[#111111]" />
                            <span>1 GitHub Repository</span>
                        </li>
                        <li className="flex items-center text-sm">
                            <Check className="h-4 w-4 shrink-0 mr-3 text-[#111111]" />
                            <span>Auto-generate drafts</span>
                        </li>
                        <li className="flex items-center text-sm">
                            <Check className="h-4 w-4 shrink-0 mr-3 text-[#111111]" />
                            <span>Standard support</span>
                        </li>
                    </ul>
                </div>

                {/* Pro Plan */}
                <div className="flex flex-col rounded-2xl p-8 w-full relative border-2 border-[#111111] bg-white">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#111111] text-white px-4 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
                        Most Popular
                    </div>
                    <div className="flex flex-col mt-2">
                        <span className="text-2xl font-bold text-[#111111] mb-2 leading-8">Pro</span>
                        <span className="text-5xl font-bold text-[#111111] leading-none tracking-tight">$19<span className="text-xl text-[#9CA3AF] font-normal">/mo</span></span>
                    </div>
                    <Link href="/login" className="w-full rounded-xl bg-[#111111] hover:bg-[#333333] text-white px-6 py-4 text-center font-semibold tracking-wide transition-colors text-base flex items-center justify-center gap-2 mt-6 mb-6">
                        Start Free Trial <ArrowRight className="h-4 w-4" />
                    </Link>
                    <ul className="mb-2 flex-1 text-[#6B7280] space-y-3">
                        <li className="flex items-center text-sm">
                            <Check className="h-4 w-4 shrink-0 mr-3 text-[#111111]" />
                            <span>Unlimited Repositories</span>
                        </li>
                        <li className="flex items-center text-sm">
                            <Check className="h-4 w-4 shrink-0 mr-3 text-[#111111]" />
                            <span>Auto-post to X (Twitter)</span>
                        </li>
                        <li className="flex items-center text-sm">
                            <Check className="h-4 w-4 shrink-0 mr-3 text-[#111111]" />
                            <span>Custom scheduling</span>
                        </li>
                        <li className="flex items-center text-sm">
                            <Check className="h-4 w-4 shrink-0 mr-3 text-[#111111]" />
                            <span>Priority support</span>
                        </li>
                    </ul>
                </div>

                {/* Team Plan */}
                <div className="flex flex-col rounded-2xl p-8 w-full border border-[#E5E7EB] bg-white hover:border-[#D1D5DB] transition-colors">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-[#111111] mb-2 leading-8">Team</span>
                        <span className="text-5xl font-bold text-[#111111] leading-none tracking-tight">$49<span className="text-xl text-[#9CA3AF] font-normal">/mo</span></span>
                    </div>
                    <Link href="/login" className="w-full rounded-xl bg-white border-2 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white px-6 py-4 text-center font-semibold tracking-wide transition-colors text-base flex items-center justify-center gap-2 mt-6 mb-6">
                        Contact Sales <ArrowRight className="h-4 w-4" />
                    </Link>
                    <ul className="mb-2 flex-1 text-[#6B7280] space-y-3">
                        <li className="flex items-center text-sm">
                            <Check className="h-4 w-4 shrink-0 mr-3 text-[#111111]" />
                            <span>Everything in Pro</span>
                        </li>
                        <li className="flex items-center text-sm">
                            <Check className="h-4 w-4 shrink-0 mr-3 text-[#111111]" />
                            <span>Up to 5 team members</span>
                        </li>
                        <li className="flex items-center text-sm">
                            <Check className="h-4 w-4 shrink-0 mr-3 text-[#111111]" />
                            <span>Multiple X accounts</span>
                        </li>
                        <li className="flex items-center text-sm">
                            <Check className="h-4 w-4 shrink-0 mr-3 text-[#111111]" />
                            <span>Analytics & Reporting</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-16 text-center relative z-10">
                <Link href="/" className="text-[#6B7280] hover:text-[#111111] transition-colors inline-flex items-center gap-2">
                    &larr; Back to Home
                </Link>
            </div>
        </div>
    );
}
