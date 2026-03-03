import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Privacy Policy | ShipInPublic",
    description: "Privacy Policy for ShipInPublic.",
};

export default function PrivacyPolicy() {
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
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
                <p className="text-sm text-[#6B7280] mb-12">Last Updated: March 2, 2026</p>

                <div className="space-y-8 text-base text-[#374151] leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">1. Introduction</h2>
                        <p>
                            At ShipInPublic ("we", "us", "our"), we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains what information we collect, how we use it, who we share it with, and how we protect it when you use our SaaS application (shipinpublic.xyz).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">2. Data We Collect</h2>
                        <p className="mb-3">We collect the following types of information when you use our Service:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Account Information:</strong> When you sign up, we collect your name, email address, profile picture, and authentication identifiers provided by our authentication provider (Clerk).</li>
                            <li><strong>OAuth Tokens & Profiles:</strong> When you connect third-party platforms like GitHub and X (Twitter), we collect OAuth access tokens necessary to perform actions on your behalf (e.g., read commit history, publish tweets). We securely encrypt and store these tokens.</li>
                            <li><strong>Commit Metadata:</strong> We collect and process the commit messages, branch names, authors, and timestamps (metadata) from your linked GitHub repositories. <strong>We do not read, clone, or store your actual source code.</strong></li>
                            <li><strong>Generated Content:</strong> We store the AI-generated social media drafts, your edits, and the final published posts to provide you with historical records and analytics tracking.</li>
                            <li><strong>Analytics Data:</strong> We track application usage, feature interaction, and the performance of your published posts (impressions, replies) to improve our Service and display your dashboard statistics.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">3. How We Use Your Data</h2>
                        <p className="mb-3">We use your information strictly to provide and improve the ShipInPublic service, specifically to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Authenticate your account and maintain active sessions.</li>
                            <li>Listen to GitHub webhooks to capture your commit activity in real-time.</li>
                            <li>Generate relevant social media post drafts using AI language models.</li>
                            <li>Publish approved posts to your connected X (Twitter) account on your behalf.</li>
                            <li>Process subscription payments and manage your billing status.</li>
                            <li>Provide customer support and send critical service updates (e.g., webhook failures, billing notices).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">4. Third-Party Processors</h2>
                        <p className="mb-3">We do not sell your personal data. We share your data only with trusted third-party service providers necessary to run our application:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Hosting & Database:</strong> Vercel (Hosting) and Neon (PostgreSQL Database) for core infrastructure.</li>
                            <li><strong>Authentication:</strong> Clerk for user sign-up and login securely.</li>
                            <li><strong>Payments:</strong> Stripe to process and manage your Pro subscription.</li>
                            <li><strong>AI Providers:</strong> Google Generative AI (Gemini) strictly to convert your commit metadata into natural language drafts. We configure API settings to ensure your data is not used to train their base models.</li>
                            <li><strong>Integrations:</strong> GitHub (to read commits) and X / Twitter (to publish posts).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">5. Data Retention and Security</h2>
                        <p>
                            We prioritize the security of your data. All sensitive information, including OAuth access tokens, is stored using AES-256-GCM encryption. We retain your account data, commit metadata, and generated drafts for as long as your account is active. If you delete your account or specific projects, we permanently delete the corresponding data and revoke our OAuth access tokens from our servers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">6. Your Data Rights</h2>
                        <p>
                            Depending on your location, you may have the right to access, correct, export, or delete your personal data. You can disconnect your GitHub or X accounts at any time from your settings page, which immediately destroys the associated access tokens on our end. To request a full account deletion and data export, please contact our support email.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#111111] mb-3">7. Contact Information</h2>
                        <p>
                            If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at support@shipinpublic.xyz.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
