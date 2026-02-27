"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Github, Search, Settings2, SlidersHorizontal, ArrowRight, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function OnboardingWizard() {
    const [step, setStep] = useState(1);
    const [selectedRepos, setSelectedRepos] = useState<string[]>([]);

    const mockRepos = [
        { id: "1", name: "ship-in-public", language: "TypeScript" },
        { id: "2", name: "next-saas-template", language: "JavaScript" },
        { id: "3", name: "rust-warp-engine", language: "Rust" },
        { id: "4", name: "cool-web-app", language: "TypeScript" },
    ];

    const toggleRepo = (id: string) => {
        setSelectedRepos(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center py-20 px-4">
            <div className="w-full max-w-2xl space-y-8">
                {/* Progress bar */}
                <div className="flex gap-4 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? "bg-[var(--hero)]" : "bg-zinc-200"}`}
                        />
                    ))}
                </div>

                {step === 1 && (
                    <Card className="border-none rounded-[2.5rem] shadow-xl shadow-zinc-200 p-6">
                        <CardHeader className="text-center space-y-4">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--hero)] text-white">
                                <Github className="h-8 w-8" />
                            </div>
                            <CardTitle className="text-4xl font-extrabold text-[var(--foreground)]">Select Repositories</CardTitle>
                            <CardDescription className="text-lg font-medium text-[var(--muted-foreground)]">
                                Choose the projects you want to build in public.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <Input placeholder="Search your repositories..." className="pl-12 h-14 rounded-2xl border-zinc-200 bg-zinc-50 font-medium" />
                            </div>
                            <div className="space-y-3">
                                {mockRepos.map((repo) => (
                                    <div
                                        key={repo.id}
                                        onClick={() => toggleRepo(repo.id)}
                                        className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${selectedRepos.includes(repo.id)
                                                ? "border-[var(--primary)] bg-[var(--primary)]/5"
                                                : "border-zinc-100 bg-white hover:border-zinc-200"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center font-bold text-zinc-500">
                                                {repo.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[var(--foreground)]">{repo.name}</div>
                                                <div className="text-xs text-[var(--muted-foreground)] font-medium">{repo.language}</div>
                                            </div>
                                        </div>
                                        {selectedRepos.includes(repo.id) && (
                                            <div className="h-6 w-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
                                                <Check className="h-4 w-4 text-[var(--primary-foreground)] font-bold" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-6">
                            <Button
                                onClick={() => setStep(2)}
                                disabled={selectedRepos.length === 0}
                                className="w-full h-16 rounded-2xl bg-[var(--hero)] text-white font-bold text-lg hover:opacity-90 transition-all border-none"
                            >
                                Continue Setup <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {step === 2 && (
                    <Card className="border-none rounded-[2.5rem] shadow-xl shadow-zinc-200 p-6">
                        <CardHeader className="text-center space-y-4">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)]">
                                <SlidersHorizontal className="h-8 w-8" />
                            </div>
                            <CardTitle className="text-4xl font-extrabold text-[var(--foreground)]">Configure Filters</CardTitle>
                            <CardDescription className="text-lg font-medium text-[var(--muted-foreground)]">
                                What should we ignore? (e.g. test commits, secret files)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                            {[
                                { title: "Exclude test files", desc: "Ignore commits only affecting /tests or **/*.spec.ts", icon: <Settings2 /> },
                                { title: "Smart grouping", desc: "Group related commits into a single daily summary thread.", icon: <Zap className="text-[var(--primary)]" /> },
                                { title: "Manual Review", desc: "Send drafts to queue instead of auto-posting directly.", icon: <ShieldCheck className="text-[var(--hero)]" /> }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                                    <div className="flex gap-4">
                                        <div className="mt-1">{item.icon}</div>
                                        <div>
                                            <div className="font-bold text-[var(--foreground)]">{item.title}</div>
                                            <div className="text-sm text-[var(--muted-foreground)] font-medium">{item.desc}</div>
                                        </div>
                                    </div>
                                    <div className="h-6 w-11 bg-[var(--primary)] rounded-full relative p-1 cursor-pointer">
                                        <div className="h-4 w-4 bg-white rounded-full absolute right-1"></div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="pt-6 gap-4">
                            <Button onClick={() => setStep(1)} variant="outline" className="h-16 flex-1 rounded-2xl font-bold border-zinc-200">
                                <ArrowLeft className="mr-2 h-5 w-5" /> Back
                            </Button>
                            <Button onClick={() => setStep(3)} className="h-16 flex-[2] rounded-2xl bg-[var(--hero)] text-white font-bold border-none">
                                Final Step <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {step === 3 && (
                    <Card className="border-none rounded-[2.5rem] shadow-xl shadow-zinc-200 p-6 text-center">
                        <CardHeader className="space-y-4">
                            <div className="mx-auto h-24 w-24 bg-[var(--primary)]/20 rounded-full flex items-center justify-center mb-4">
                                <div className="h-16 w-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--primary-foreground)]">
                                    <Check className="h-10 w-10 stroke-[3px]" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-extrabold text-[var(--foreground)]">All set!</CardTitle>
                            <CardDescription className="text-lg font-medium text-[var(--muted-foreground)] max-w-sm mx-auto">
                                We've connected your repos. ShipInPublic is now listening for commits.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-10">
                            <Button
                                onClick={() => window.location.href = "/dashboard"}
                                className="w-full h-20 rounded-3xl bg-[var(--hero)] text-white font-bold text-xl hover:scale-[1.02] transition-transform border-none flex items-center justify-center gap-3"
                            >
                                Go to Dashboard <ArrowRight className="h-6 w-6" />
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

function Zap(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 14.71 14 3h1l-2 9h7l-10 11.71h-1l2-9H4z" />
        </svg>
    );
}

function ShieldCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
