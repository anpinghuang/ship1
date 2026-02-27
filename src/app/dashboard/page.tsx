import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCommit, Send, Clock, TrendingUp, Github, Twitter, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const stats = [
        { label: "Scheduled", value: "8", icon: <Clock className="text-[var(--hero)]" />, trend: "+2 today" },
        { label: "Published", value: "42", icon: <Send className="text-[var(--primary)]" />, trend: "+12 this week" },
        { label: "Activity Sync", value: "98%", icon: <GitCommit className="text-[var(--hero)]" />, trend: "Real-time" },
        { label: "Reach", value: "1.2k", icon: <TrendingUp className="text-[var(--primary)]" />, trend: "Top 5%" },
    ];

    return (
        <div className="space-y-10">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold text-[var(--foreground)] tracking-tight mb-2">Dashboard Overview</h1>
                    <p className="text-[var(--muted-foreground)] font-medium text-lg italic">Welcome back! Your AI has drafted 3 new updates based on your latest activity.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-400 bg-white px-4 py-2 rounded-xl border border-zinc-100">
                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                    GitHub Webhook: Active
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-xl hover:shadow-[var(--hero)]/5 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                                {stat.label}
                            </CardTitle>
                            <div className="h-10 w-10 rounded-2xl bg-zinc-50 flex items-center justify-center">
                                {stat.icon}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black text-[var(--foreground)]">{stat.value}</div>
                            <p className="text-xs text-[var(--primary)] font-bold mt-2">
                                {stat.trend}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-[var(--foreground)]">Recent GitHub Activity</h2>
                        <Button variant="ghost" className="text-sm font-bold text-[var(--hero)]">View All</Button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { repo: "ship-in-public", type: "Commit", msg: "Refactored the AI prompt orchestration", time: "2h ago", id: "7a2b9f1" },
                            { repo: "next-saas-template", type: "PR Merge", msg: "Added Stripe integration layer", time: "5h ago", id: "merge-#42" },
                            { repo: "ship-in-public", type: "Release", msg: "v1.0.4-beta: Dashboard Init", time: "Yesterday", id: "v1.0.4" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-zinc-100 hover:border-[var(--hero)]/30 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 rounded-2xl bg-zinc-50 flex items-center justify-center">
                                        <Github className="text-zinc-400 group-hover:text-[var(--hero)] transition-colors" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-[var(--foreground)]">{item.repo}</span>
                                            <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-zinc-100 rounded-md text-zinc-500">{item.type}</span>
                                        </div>
                                        <p className="text-sm font-medium text-[var(--muted-foreground)]">{item.msg}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-[var(--foreground)]">{item.time}</div>
                                    <div className="text-xs font-medium text-zinc-300">ID: {item.id}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Drafts Queue */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-[var(--foreground)]">Drafts Queue</h2>
                    <div className="bg-[var(--hero)] rounded-[2.5rem] p-8 text-white space-y-6 shadow-xl shadow-[var(--hero)]/20">
                        <div className="flex items-center justify-between">
                            <Twitter className="h-8 w-8 text-[var(--primary)]" />
                            <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest">AI Suggestion</span>
                        </div>
                        <p className="font-medium text-lg leading-relaxed">
                            "Just pushed a major refactor for the AI pipeline! We're now generating 3 variants per commit with 95% tone accuracy. Real-time shipping is almost here. 🚀"
                        </p>
                        <div className="pt-4 flex gap-3">
                            <Button className="flex-1 bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 font-bold border-none rounded-2xl h-14">
                                Publish
                            </Button>
                            <Button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold border-white/20 rounded-2xl h-14" variant="outline">
                                Edit
                            </Button>
                        </div>
                    </div>

                    <Card className="border-none bg-zinc-900 rounded-[2.5rem] p-8 text-white overflow-hidden relative">
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-xl font-bold">Upcoming: Friday Recap</h3>
                            <div className="flex items-center gap-2 text-[var(--primary)] font-bold text-sm">
                                <Clock size={16} /> Tomorrow at 10:00 AM
                            </div>
                            <p className="text-white/50 text-sm font-medium">
                                Your weekly digest is being curated from 12 commits and 2 releases.
                            </p>
                            <Button variant="link" className="p-0 text-white font-bold flex items-center gap-2 hover:text-[var(--primary)]">
                                Preview Thread <ExternalLink size={14} />
                            </Button>
                        </div>
                        <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-[var(--hero)]/30 rounded-full blur-3xl"></div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
