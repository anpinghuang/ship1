import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Refund Policy | ShipInPublic",
    description: "Refund Policy for ShipInPublic.",
};

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-white text-[#111111] selection:bg-black/10">
            <header className="border-b border-[#E5E7EB] bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#111111] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Refund Policy</h1>
                <p className="text-sm text-[#6B7280] mb-12">Last Updated: March 2, 2026</p>

                <div className="space-y-8 text-base text-[#374151] leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">1. Subscription Billing Terms</h2>
                        <p>
                            ShipInPublic operates on an automatic recurring subscription basis. Depending on the plan you select, your subscription will be billed automatically in advance on a monthly or annual basis. You authorize us to store your payment method via our trusted third-party payment processor (Stripe) and automatically charge it on the renewal date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">2. Refund Eligibility</h2>
                        <p className="mb-3">Our policy on refunds for paid subscriptions is as follows:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>No Partial Refunds:</strong> We do not offer refunds or credits for partial months of service, unused months of an annual subscription, or for periods in which your account was active but the Service was unused.</li>
                            <li><strong>Cancellation Grace Period:</strong> You may cancel your subscription at any time. If you cancel before your next billing cycle, you will not be charged again. You will continue to have access to your paid features until the end of your current paid billing period.</li>
                            <li><strong>Annual Subscriptions:</strong> Annual subscription purchases are final. If you choose to cancel, your premium access continues until the end of your prepaid year, but no prorated refund will be issued.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">3. Exceptions Required by Law</h2>
                        <p>
                            We honor all refund requests strictly required by consumer protection laws in your jurisdiction (e.g., if you are an EU resident requesting a refund within a mandatory cooling-off period). Please explicitly mention your jurisdiction when requesting a refund under these statutory rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">4. Accidental or Duplicate Billing</h2>
                        <p>
                            If you believe you have been billed in error or double-charged due to a technical glitch, please contact us within 14 days of the charge date with the receipt details. Once verified, we will issue a full refund for the duplicate or accidental charge.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">5. How to Request a Refund or Cancel</h2>
                        <p>
                            You can cancel your subscription at any time directly through your ShipInPublic account dashboard settings. For inquiries regarding accidental charges or legally mandated exception refunds, please contact us directly at support@shipinpublic.xyz with your account email and a description of the issue.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
