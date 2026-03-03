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
                        <h2 className="text-xl font-bold text-[#111111] mb-3">2. Eligibility</h2>
                        <p>
                            You must be at least 18 years of age, or the age of legal majority in your jurisdiction, to create an account and use the Service. By using the Service, you represent and warrant that you meet these age requirements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">3. Description of Service</h2>
                        <p>
                            ShipInPublic is a Software-as-a-Service (SaaS) platform that connects to your GitHub and X (Twitter) accounts to automatically generate AI-assisted social media drafts based on your code commits. You may review, edit, and publish these drafts directly through our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">4. Subscription Billing and Renewals</h2>
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
                        <h2 className="text-xl font-bold text-[#111111] mb-3">5. Third-Party Integrations</h2>
                        <p>
                            The Service requires access to third-party platforms, specifically GitHub and X (Twitter), via OAuth. You are solely responsible for complying with the respective Terms of Service of these third-party platforms. We are not liable for any actions taken by GitHub or X (Twitter), including rate limiting, account suspension, or API changes that may affect our Service's functionality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">6. Account Responsibility and Acceptable Use</h2>
                        <p className="mb-3">
                            You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree not to use the Service to:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Generate or publish content that is illegal, abusive, harassing, or defamatory.</li>
                            <li>Violate the intellectual property rights of others.</li>
                            <li>Spam, manipulate, or otherwise abuse the X (Twitter) platform.</li>
                            <li>Attempt to reverse engineer, hack, or disrupt the Service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">7. Termination</h2>
                        <p>
                            You may terminate your account at any time through your dashboard settings. We may suspend or terminate your access to the Service at any time, with or without notice, for any violation of these Terms, if required by law, or for any other operational reason. Upon termination, your right to use the Service will immediately cease. Any data associated with your account will be handled according to our Privacy Policy. Refunds upon termination are strictly governed by our Refund Policy; we do not owe refunds for mid-cycle suspensions resulting from ToS violations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">8. Intellectual Property and Content</h2>
                        <p>
                            You retain all ownership rights to the original code commits and the final social media posts you publish. By using the Service, you grant us a temporary, limited license to process your commit metadata solely for the purpose of generating draft content via our AI providers. We do not claim ownership of your output.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">9. Disclaimers: Service Availability & AI Limitations</h2>
                        <p className="mb-3">
                            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We explicitly disclaim all warranties of any kind, whether express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Service Availability:</strong> We do not guarantee uninterrupted, secure, or error-free availability of the Service. You acknowledge that downtime, API outages, data loss, and third-party breaking changes (e.g., from GitHub or X) may occur.</li>
                            <li><strong>AI Limitations:</strong> The Service uses artificial intelligence to generate draft content. This content may occasionally be inaccurate, inappropriate, or require editing. You are entirely responsible for reviewing all AI-generated drafts before publishing them.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">10. Indemnification</h2>
                        <p>
                            You agree to indemnify, defend, and hold harmless ShipInPublic, its affiliates, directors, and employees from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising out of: (i) your misuse of the Service; (ii) your violation of these Terms; or (iii) your violation of any third-party right, including without limitation any intellectual property, privacy, or terms of service of connected platforms (GitHub, X).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">11. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by law, in no event shall ShipInPublic, its founders, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or reputation, arising from your use of or inability to use the Service. Our total liability shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">12. Force Majeure</h2>
                        <p>
                            ShipInPublic will not be liable for any failure or delay in performance under these Terms due to circumstances beyond our reasonable control, including, but not limited to, natural disasters, acts of God, governmental actions, war, terrorism, labor disputes, server outages, internet service provider failures, or cloud hosting infrastructure failures.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">13. Binding Arbitration and Class Action Waiver</h2>
                        <p>
                            Any dispute, claim, or controversy arising out of or relating to these Terms or the breach, termination, enforcement, interpretation, or validity thereof, shall be determined by final and binding arbitration, rather than in court. You and ShipInPublic agree that each may bring claims against the other only in your or its individual capacity, and not as a plaintiff or class member in any purported class or representative proceeding.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">14. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">15. General Provisions</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Severability:</strong> If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions of these Terms will remain in effect.</li>
                            <li><strong>Assignment:</strong> You may not assign or transfer these Terms without our prior written consent. We may assign these Terms, without restriction, including in connection with a merger, acquisition, or sale of assets.</li>
                            <li><strong>Changes to Terms:</strong> We reserve the right to modify these Terms at any time. We will notify you of any material changes via email or a prominent notice on our website. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.</li>
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
}
