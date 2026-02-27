"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Trash2,
    GitBranch,
    FileCode,
    MessageSquare,
    Filter,
    Zap,
    ArrowRight
} from "lucide-react";

export default function RulesBuilderPage() {
    const rules = [
        {
            id: "1",
            type: "Filter",
            title: "Ignore Test Files",
            desc: "Automatically skip commits that only modify files in /tests or match **/*.spec.ts",
            icon: <FileCode className="text-[var(--hero)]" />,
            status: "Active"
        },
        {
            id: "2",
            type: "Format",
            title: "Thread Grouping",
            desc: "Group all commits from the same PR into a structured X thread instead of individual posts.",
            icon: <Zap className="text-[var(--primary)]" />,
            status: "Active"
        },
        {
            id: "3",
            type: "Filter",
            title: "Branch Exclusion",
            desc: "Only track activity on 'main' and 'develop' branches.",
            icon: <GitBranch className="text-[var(--hero)]" />,
            status: "Paused"
        }
    ];

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold text-[var(--foreground)] tracking-tight">Automation Rules</h1>
                    <p className="text-[var(--muted-foreground)] font-medium text-lg italic">Control exactly how your GitHub activity becomes public stories.</p>
                </div>
                <Button className="bg-[var(--hero)] text-white font-bold h-14 px-8 rounded-2xl border-none shadow-xl shadow-[var(--hero)]/20">
                    <Plus className="mr-2 h-5 w-5" /> Create Rule
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rules.map((rule) => (
                    <Card key={rule.id} className="group relative border-none bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-[var(--hero)]/5 transition-all overflow-hidden border border-zinc-50">
                        <CardHeader className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="h-14 w-14 rounded-2xl bg-zinc-50 flex items-center justify-center">
                                    {rule.icon}
                                </div>
                                <Badge variant={rule.status === "Active" ? "default" : "secondary"} className={rule.status === "Active" ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)] font-bold border-none" : "bg-zinc-100 text-zinc-400 font-bold border-none"}>
                                    {rule.status}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-extrabold text-[var(--foreground)]">{rule.title}</CardTitle>
                                <p className="text-[var(--muted-foreground)] font-bold text-xs uppercase tracking-widest">{rule.type} RULE</p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <CardDescription className="text-zinc-600 font-medium leading-relaxed h-12">
                                {rule.desc}
                            </CardDescription>
                            <div className="flex items-center gap-2 pt-4 border-t border-zinc-50">
                                <Button variant="ghost" className="text-xs font-bold text-[var(--hero)] hover:bg-[var(--hero)]/5 p-2 px-4 rounded-xl">Edit Logic</Button>
                                <Button variant="ghost" className="text-xs font-bold text-red-400 hover:bg-red-50 p-2 px-4 rounded-xl ml-auto">
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <button className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-zinc-100 rounded-[2.5rem] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5 transition-all text-zinc-300 hover:text-[var(--primary)] group">
                    <div className="h-16 w-16 rounded-full bg-zinc-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus size={32} />
                    </div>
                    <span className="font-bold text-lg">Add New Rule</span>
                </button>
            </div>

            <Card className="bg-[var(--hero)] rounded-[2.5rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-[var(--hero)]/30 border-none">
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-extrabold tracking-tight">Need a custom workflow?</h2>
                        <p className="text-white/70 text-lg font-medium">
                            We're building advanced conditional logic for Power Users. Join the waitlist for the Rules Engine V2.
                        </p>
                        <Button className="bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-lg h-16 px-10 rounded-2xl border-none">
                            Request Feature <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/10 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-[var(--primary)]"></div>
                            <span className="font-bold text-sm tracking-widest uppercase">Upcoming Feature</span>
                        </div>
                        <div className="h-4 w-full bg-white/10 rounded-full"></div>
                        <div className="h-4 w-2/3 bg-white/10 rounded-full"></div>
                        <div className="h-4 w-1/2 bg-white/10 rounded-full"></div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
