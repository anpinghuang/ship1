import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Twitter, ArrowRight, Zap, RefreshCw, BarChart3, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--hero)] text-white font-bold text-xl">
              S
            </div>
            <span className="text-2xl font-bold tracking-tight text-[var(--foreground)]">ShipInPublic</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--foreground)]/70">
            <a href="#features" className="hover:text-[var(--hero)] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[var(--hero)] transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-[var(--hero)] transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="font-semibold text-[var(--foreground)]">Log in</Button>
            <Button className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 font-bold px-8 rounded-full h-11 border-none">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[var(--hero)] pt-24 pb-32 md:pt-32 md:pb-48">
          <div className="container relative z-10 mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-[var(--primary)]"></span>
                  Build in public, automated.
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                  Turn your commits into <span className="text-[var(--primary)]">storytelling.</span>
                </h1>
                <p className="text-xl md:text-2xl text-[var(--muted-foreground)] max-w-xl font-medium">
                  Stop manually tweeting your progress. ShipInPublic bridges GitHub activity to X with AI-powered updates that engage your audience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 font-bold text-lg h-16 px-10 rounded-2xl shadow-xl shadow-[black]/10">
                    Connect GitHub <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 font-bold text-lg h-16 px-10 rounded-2xl">
                    View Demo
                  </Button>
                </div>
              </div>

              {/* Floating Preview Card */}
              <div className="relative lg:block hidden">
                <div className="absolute -inset-4 bg-[var(--primary)]/20 blur-3xl opacity-50 rounded-full"></div>
                <Card className="relative border-none bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/20">
                  <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                        <Github className="text-white h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">main.rs</div>
                        <div className="text-white/50 text-xs">Commit: 7a2b9f1</div>
                      </div>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-[var(--primary)]"></div>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                      <code className="text-[var(--primary)] text-sm font-mono">+ Added real-time thread generation</code>
                      <br />
                      <code className="text-white/40 text-sm font-mono">- Mock implementation removed</code>
                    </div>
                    <div className="flex justify-center">
                      <RefreshCw className="text-[var(--primary)] h-8 w-8 animate-spin-slow" />
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-blue-500"></div>
                        <div>
                          <div className="font-bold text-[var(--foreground)] text-sm">ShipInPublic AI</div>
                          <div className="text-[var(--foreground)]/50 text-xs">Drafting thread...</div>
                        </div>
                      </div>
                      <p className="text-[var(--foreground)] font-medium leading-relaxed">
                        Just pushed a major update to the core engine! 🚀

                        We've swapped out the mock layers for real-time thread generation using GPT-4o. The speed is incredible.

                        #buildinpublic #shipit
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 h-[600px] w-[600px] rounded-full bg-[var(--primary)]/10 blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-[600px] w-[600px] rounded-full bg-[var(--primary)]/10 blur-[100px]"></div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
                Built for builders who move fast.
              </h2>
              <p className="text-xl text-[var(--muted-foreground)] font-medium">
                ShipInPublic automates the "boring" part of growth so you can focus on the code.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "GitHub Ingestion",
                  desc: "Connect your repos and let us track commits, PRs, and releases automatically via webhooks.",
                  icon: <Github className="h-8 w-8 text-[var(--hero)]" />
                },
                {
                  title: "AI Storytelling",
                  desc: "Our pipeline transforms technical changes into engaging X threads with tone control.",
                  icon: <Zap className="h-8 w-8 text-[var(--primary)]" />
                },
                {
                  title: "Smart Scheduling",
                  desc: "Auto-publish or review drafts. Set cadence, quiet hours, and batch updates for maximum reach.",
                  icon: <RefreshCw className="h-8 w-8 text-[var(--hero)]" />
                }
              ].map((f, i) => (
                <Card key={i} className="group p-8 border-none bg-zinc-50 rounded-3xl hover:bg-[var(--hero)] transition-all duration-300">
                  <div className="mb-6 p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[var(--foreground)] group-hover:text-white transition-colors">{f.title}</h3>
                  <p className="text-[var(--muted-foreground)] group-hover:text-white/80 transition-colors leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-24 bg-zinc-50 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-16 relative shadow-sm border border-zinc-100">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] tracking-tight mb-8">
                    Your automated shipping pipeline.
                  </h2>
                  <div className="space-y-8">
                    {[
                      {
                        step: "01",
                        title: "Push your code",
                        desc: "Keep doing what you do best. Push commits or merge PRs on GitHub."
                      },
                      {
                        step: "02",
                        title: "AI analyzes & drafts",
                        desc: "We parse your diffs and generate 3 variants of a perfect X post."
                      },
                      {
                        step: "03",
                        title: "Ship it to X",
                        desc: "Approve the draft or let our scheduler handle it automatically."
                      }
                    ].map((s, i) => (
                      <div key={i} className="flex gap-6">
                        <span className="text-4xl font-black text-[var(--primary)]/30">{s.step}</span>
                        <div>
                          <h4 className="text-xl font-bold text-[var(--foreground)] mb-2">{s.title}</h4>
                          <p className="text-[var(--muted-foreground)] font-medium tracking-tight">
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[var(--hero)] rounded-3xl p-8 text-white relative">
                  <div className="absolute top-0 right-0 p-4">
                    <ShieldCheck className="text-[var(--primary)] h-10 w-10" />
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-white/20"></div>
                      <div>
                        <div className="font-bold">Latest Post</div>
                        <div className="text-white/60 text-sm italic">Scheduled for 10:00 AM</div>
                      </div>
                    </div>
                    <div className="p-6 bg-white/10 rounded-2xl border border-white/10 font-medium">
                      "I just pushed a new feature to the UI layer! Using shadcn hooks for better state management. Check out the diff below. 💪"
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-[var(--primary)]">98% Tone Sync</span>
                      <span className="px-3 py-1 bg-white/20 rounded-full">Draft #2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="bg-[var(--hero)] rounded-[2.5rem] p-12 md:p-24 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-[var(--hero)]/30">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--hero)] to-[#4B3DFF] opacity-50"></div>
              <div className="relative z-10 w-full max-w-2xl mx-auto space-y-6">
                <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                  Ready to build <br className="hidden md:block" /> with an audience?
                </h2>
                <p className="text-xl text-white/70 font-medium">
                  Join 500+ developers automating their progress updates today.
                </p>
                <div className="pt-6">
                  <Button size="lg" className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:scale-105 transition-transform font-bold text-xl h-20 px-12 rounded-3xl border-none shadow-xl shadow-black/20">
                    Start Shipping For Free
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t">
        <div className="container mx-auto px-6 text-center text-[var(--muted-foreground)] font-medium">
          <p>© 2024 ShipInPublic. Built for developers by developers.</p>
        </div>
      </footer>
    </div>
  );
}
