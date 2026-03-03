import Link from "next/link";
import { Check, ArrowRight, Github, Code2, MessageSquare, Zap, Clock, BarChart3, Send } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] selection:bg-black/10">

      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-[#111111] flex items-center justify-center">
              <Send className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#111111]">ShipInPublic</span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-10 text-[14px] font-medium text-[#6B7280]">
            <Link href="#features" className="hover:text-[#111111] transition-colors">Features</Link>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#111111] transition-colors">X</a>
            <Link href="#pricing" className="hover:text-[#111111] transition-colors">Pricing</Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4 shrink-0">
            <SignedOut>
              <Link href="/login" className="text-[14px] font-medium text-[#6B7280] hover:text-[#111111] transition-colors hidden sm:block">
                Log in
              </Link>
              <Link href="/login" className="text-[14px] font-medium text-white bg-[#111111] hover:bg-[#333333] rounded-full px-5 py-2 transition-colors">
                Sign Up
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-[14px] font-medium text-white bg-[#111111] hover:bg-[#333333] rounded-full px-5 py-2 transition-colors">
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
          <h1
            className="font-extrabold text-[#111111] leading-[1.08] tracking-tight max-w-3xl mb-5"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
          >
            Automate your<br />
            <span className="text-[#111111]">#BuildInPublic</span> updates
          </h1>

          <p className="text-[#6B7280] text-lg md:text-xl max-w-xl leading-relaxed mb-10">
            Connect your GitHub repos. Let AI craft polished posts from your commits and publish them to X — automatically.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-base font-semibold text-white bg-[#111111] hover:bg-[#333333] rounded-full px-8 py-3.5 transition-colors"
          >
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── Abstract Illustration ─── */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">

            {/* Code Block Card */}
            <div className="w-full max-w-xs bg-[#1A1A2E] rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="font-mono text-xs text-[#9CA3AF] space-y-2">
                <p><span className="text-[#6EE7B7]">git</span> commit -m</p>
                <p className="text-white/80">&quot;feat: add user auth flow&quot;</p>
                <p className="text-[#6B7280] mt-3">3 files changed, 142 insertions</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-[#E5E7EB] flex items-center justify-center bg-white shadow-sm">
                <ArrowRight className="w-5 h-5 text-[#111111]" />
              </div>
            </div>

            {/* Tweet Card */}
            <div className="w-full max-w-xs bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#F3F4F6] border border-[#E5E7EB]" />
                <div>
                  <div className="text-sm font-bold text-[#111111]">You</div>
                  <div className="text-xs text-[#9CA3AF]">@yourhandle</div>
                </div>
              </div>
              <p className="text-sm text-[#374151] leading-relaxed">
                🚀 Just shipped user authentication! OAuth, session management, and protected routes — all wired up.
                <span className="text-[#6B7280]"> #BuildInPublic</span>
              </p>
              <div className="flex items-center gap-6 mt-4 text-xs text-[#9CA3AF]">
                <span>♡ 24</span>
                <span>↺ 8</span>
                <span>💬 3</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="py-20 md:py-28 border-t border-[#F3F4F6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-[0.2em] mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-tight">
              Everything you need to ship publicly
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Code2 className="w-5 h-5" />,
                title: "GitHub Integration",
                desc: "Connect any repo in one click. We listen to commits, PRs, and releases — never your source code."
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: "AI-Powered Drafts",
                desc: "Our AI reads your commit context and generates polished, on-brand posts in seconds. Edit or auto-publish."
              },
              {
                icon: <Clock className="w-5 h-5" />,
                title: "Smart Scheduling",
                desc: "Set your posting times and let updates drip out automatically. Stay consistent without lifting a finger."
              },
            ].map((f, i) => (
              <div key={i} className="bg-[#FAFAFA] border border-[#F3F4F6] rounded-2xl p-8 hover:border-[#E5E7EB] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">{f.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 md:py-28 border-t border-[#F3F4F6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-[0.2em] mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-tight">
              Three steps to autopilot
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Connect your repo",
                desc: "Sign up and link your GitHub repository. We only need read access to commit metadata."
              },
              {
                step: "2",
                title: "AI drafts your posts",
                desc: "Every push triggers an AI draft. Review, edit, or enable full autopilot to skip the queue."
              },
              {
                step: "3",
                title: "Publish to X",
                desc: "Posts go out on your schedule. Grow your audience while you stay focused on building."
              }
            ].map((s, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="w-10 h-10 rounded-full bg-[#111111] text-white font-bold flex items-center justify-center text-sm mb-5 mx-auto md:mx-0">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">{s.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─── */}
      <section id="pricing" className="py-20 md:py-28 border-t border-[#F3F4F6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-[#6B7280] text-base max-w-xl mx-auto">
              Choose the plan that fits. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Pro Plan */}
            <div className="border-2 border-[#111111] rounded-2xl p-8 md:p-10 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#111111] text-white px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#111111] mb-1">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-[#111111] tracking-tight">$19</span>
                  <span className="text-[#9CA3AF] text-lg">/mo</span>
                </div>
              </div>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 text-base font-semibold text-white bg-[#111111] hover:bg-[#333333] rounded-xl px-6 py-3.5 transition-colors mb-8"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <ul className="space-y-4">
                {["Unlimited Repositories", "Auto-post to X (Twitter)", "Custom scheduling", "Priority support"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#374151]">
                    <Check className="w-4 h-4 text-[#111111] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Custom Plan */}
            <div className="border border-[#E5E7EB] rounded-2xl p-8 md:p-10">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#111111] mb-1">Custom</h3>
                <div className="text-4xl font-bold text-[#111111] tracking-tight">Let&apos;s Talk</div>
              </div>
              <Link
                href="#"
                className="w-full inline-flex items-center justify-center gap-2 text-base font-semibold text-[#111111] bg-white border-2 border-[#111111] hover:bg-[#111111] hover:text-white rounded-xl px-6 py-3.5 transition-colors mb-8"
              >
                Contact Sales
                <ArrowRight className="w-4 h-4" />
              </Link>
              <ul className="space-y-4">
                {["Everything in Pro", "Custom AI fine-tuning", "Multiple X accounts", "Dedicated account manager"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#374151]">
                    <Check className="w-4 h-4 text-[#111111] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-20 md:py-28 border-t border-[#F3F4F6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-tight">
              Frequently asked questions
            </h2>
          </div>

          <div className="max-w-2xl mx-auto rounded-2xl border border-[#E5E7EB] overflow-hidden">
            {[
              { q: "How does the AI know what I'm building?", a: "We securely listen to your commit messages, PR descriptions, and release notes via GitHub webhooks. We never read your actual source code." },
              { q: "Can I review posts before they go live?", a: "Yes. By default, the engine generates Drafts that you can approve, edit, or delete. You can enable full Auto-Pilot anytime." },
              { q: "Do you support platforms other than X?", a: "X (Twitter) is the only platform for MVP. More platforms are on the roadmap." },
              { q: "What if my commits are messy?", a: "Our AI understands context and can combine multiple small commits into one cohesive update, or ask for brief clarifications if needed." },
              { q: "Is my code safe?", a: "We only require read access to metadata (commit messages, branches). Your source code remains 100% private." }
            ].map((faq, i) => (
              <details key={i} className="group border-b border-[#E5E7EB] last:border-b-0">
                <summary className="flex items-center justify-between px-6 py-5 text-base font-semibold text-[#111111] cursor-pointer list-none gap-4 hover:bg-[#FAFAFA] transition-colors">
                  {faq.q}
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] transition-transform group-open:rotate-45 text-xl leading-none font-light">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 text-sm text-[#6B7280] leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="py-20 md:py-28 border-t border-[#F3F4F6]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-tight mb-5 max-w-2xl mx-auto">
            Start building in public today
          </h2>
          <p className="text-[#6B7280] text-base mb-10 max-w-xl mx-auto">
            Join developers who grow their audience on autopilot while they code.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-base font-semibold text-white bg-[#111111] hover:bg-[#333333] rounded-full px-8 py-3.5 transition-colors"
          >
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-16 border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            {/* Logo & Info */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-[#111111] flex items-center justify-center">
                  <Send className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-lg text-[#111111]">ShipInPublic</span>
              </div>
              <p className="text-sm text-[#9CA3AF] leading-relaxed mb-5">
                Turn your GitHub activity into audience growth on X — automatically.
              </p>
              <div className="flex items-center gap-4 text-[#9CA3AF]">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#111111] transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#111111] transition-colors font-bold text-sm">
                  X
                </a>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
              <div>
                <h4 className="text-sm font-bold text-[#111111] mb-4 uppercase tracking-wider">Product</h4>
                <ul className="space-y-3 text-sm text-[#6B7280]">
                  <li><Link href="#features" className="hover:text-[#111111] transition-colors">Features</Link></li>
                  <li><Link href="#pricing" className="hover:text-[#111111] transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-[#111111] transition-colors">Changelog</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#111111] mb-4 uppercase tracking-wider">Resources</h4>
                <ul className="space-y-3 text-sm text-[#6B7280]">
                  <li><Link href="#" className="hover:text-[#111111] transition-colors">Blog</Link></li>
                  <li><Link href="#" className="hover:text-[#111111] transition-colors">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-[#111111] transition-colors">API Docs</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#111111] mb-4 uppercase tracking-wider">Legal</h4>
                <ul className="space-y-3 text-sm text-[#6B7280]">
                  <li><Link href="/terms-and-conditions" className="hover:text-[#111111] transition-colors">Terms & Conditions</Link></li>
                  <li><Link href="/privacy-policy" className="hover:text-[#111111] transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/refund-policy" className="hover:text-[#111111] transition-colors">Refund Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#E5E7EB] text-xs text-[#9CA3AF]">
            &copy; 2026 ShipInPublic Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
