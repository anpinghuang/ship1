import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Terms and Conditions | ShipInPublic",
    description: "Terms and Conditions for ShipInPublic.",
};

export default function TermsAndConditions() {
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
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Terms and Conditions</h1>
                <p className="text-sm text-[#6B7280] mb-12">Last Updated: March 2, 2026</p>

                <div className="space-y-8 text-base text-[#374151] leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">1. Acceptance of Terms & Incorporated Policies</h2>
                        <p className="mb-3">
                            By accessing or using the ShipInPublic SaaS platform (the "Service", "we", "our", or "us"), available at <a href="https://shipinpublic.xyz" className="text-[#111111] underline underline-offset-4">https://shipinpublic.xyz</a>, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you may not use the Service.
                        </p>
                        <p>
                            These Terms and Conditions explicitly govern your use of the ShipInPublic SaaS platform and incorporate our other legal policies by reference. Please read them carefully:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Our <Link href="/privacy-policy" className="text-[#111111] font-semibold underline underline-offset-4">Privacy Policy</Link>, which details how we process your account data, authentication tokens, and commit metadata.</li>
                            <li>Our <Link href="/refund-policy" className="text-[#111111] font-semibold underline underline-offset-4">Refund Policy</Link>, which governs subscription billing rules, cancellation terms, and refund eligibility.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">2. Description of Service</h2>
                        <p>
                            ShipInPublic is a Software-as-a-Service (SaaS) platform that connects to your GitHub and X (Twitter) accounts to automatically generate AI-assisted social media drafts based on your code commits. You may review, edit, and publish these drafts directly through our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">3. Subscription Billing and Renewals</h2>
                        <p className="mb-3">
                            We offer paid subscription plans ("Pro Plan") that provide access to premium features. By purchasing a subscription, you agree to the following terms:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Billing Cycle:</strong> Subscriptions are billed on a recurring, periodic basis (usually monthly or annually).</li>
                            <li><strong>Automatic Renewals:</strong> Your subscription will automatically renew at the end of each billing cycle unless you cancel it before the renewal date.</li>
                            <li><strong>Payment Information:</strong> You must provide a valid payment method. By providing it, you authorize us (via our third-party payment processors) to charge your payment method for all subscription fees.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">4. Third-Party Integrations</h2>
                        <p>
                            The Service requires access to third-party platforms, specifically GitHub and X (Twitter), via OAuth. You are solely responsible for complying with the respective Terms of Service of these third-party platforms. We are not liable for any actions taken by GitHub or X (Twitter), including rate limiting, account suspension, or API changes that may affect our Service's functionality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">5. Account Responsibility and Acceptable Use</h2>
                        <p className="mb-3">
                            You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree not to use the Service to:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Generate or publish content that is illegal, abusive, harassing, or defamatory.</li>
                            <li>Violate the intellectual property rights of others.</li>
                            <li>Spam, manipulate, or otherwise abuse the X (Twitter) platform.</li>
                            <li>Attempt to reverse engineer, hack, or disrupt the Service.</li>
                        </ul>
                        <p className="mt-3">
                            We reserve the right to suspend or terminate your account immediately if we determine you have violated these rules.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">6. Intellectual Property and Content</h2>
                        <p>
                            You retain all ownership rights to the original code commits and the final social media posts you publish. By using the Service, you grant us a temporary, limited license to process your commit metadata solely for the purpose of generating draft content via our AI providers. We do not claim ownership of your output.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">7. Disclaimers and AI Limitations</h2>
                        <p>
                            The Service uses artificial intelligence to generate draft content. This content is provided "AS IS" and may occasionally be inaccurate, inappropriate, or require editing. You are entirely responsible for reviewing all AI-generated drafts before publishing them to your social media accounts. We disclaim all warranties, express or implied, regarding the accuracy or reliability of the generated content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">8. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by law, in no event shall ShipInPublic, its founders, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or reputation, arising from your use of or inability to use the Service. Our total liability shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">9. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction/State], without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or state courts located in [Your Jurisdiction/State].
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">10. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms at any time. We will notify you of any material changes via email or a prominent notice on our website. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
