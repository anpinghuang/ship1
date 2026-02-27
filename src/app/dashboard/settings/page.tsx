"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Twitter,
    User,
    Palette,
    Bell,
    Shield,
    Github,
    CheckCircle2,
    RefreshCw
} from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl space-y-12">
            <div>
                <h1 className="text-4xl font-extrabold text-[var(--foreground)] tracking-tight mb-2">Settings</h1>
                <p className="text-[var(--muted-foreground)] font-medium text-lg italic">Manage your brand tone, connected accounts, and preferences.</p>
            </div>

            <div className="grid gap-10">
                {/* Account Profile */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-zinc-400 tracking-widest pl-1">
                        <User size={14} className="text-[var(--hero)]" /> Profile Information
                    </div>
                    <Card className="border-none bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-50">
                        <div className="flex items-center gap-8">
                            <div className="h-24 w-24 rounded-full bg-[var(--hero)] flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-[var(--hero)]/20">
                                JD
                            </div>
                            <div className="space-y-4 flex-1">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-zinc-500">Full Name</Label>
                                        <Input defaultValue="John Doe" className="h-12 rounded-xl bg-zinc-50 border-zinc-100 font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-zinc-500">Email Address</Label>
                                        <Input defaultValue="john@example.com" className="h-12 rounded-xl bg-zinc-50 border-zinc-100 font-medium" />
                                    </div>
                                </div>
                                <Button className="bg-[var(--hero)] text-white font-bold h-11 px-6 rounded-xl border-none">Save Profile</Button>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* AI Tone & Style */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-zinc-400 tracking-widest pl-1">
                        <Palette size={14} className="text-[var(--primary)]" /> AI Persona & Tone
                    </div>
                    <Card className="border-none bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-50 space-y-8">
                        <div className="grid md:grid-cols-3 gap-4">
                            {["Technical", "Hype", "Professional", "Casual", "Minimalist"].map((tone) => (
                                <div
                                    key={tone}
                                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${tone === "Technical" ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-zinc-50 bg-zinc-50/50 hover:bg-zinc-50"}`}
                                >
                                    <div className={`h-3 w-3 rounded-full ${tone === "Technical" ? "bg-[var(--primary)]" : "bg-zinc-200"}`}></div>
                                    <span className="font-bold text-[var(--foreground)]">{tone}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-zinc-500">Custom System Instructions</Label>
                            <textarea className="w-full min-h-[120px] rounded-2xl bg-zinc-50 border border-zinc-100 p-6 text-sm font-medium focus:ring-2 focus:ring-[var(--hero)]/20 outline-none transition-all" placeholder="Tell the AI how to talk about your code... e.g. Always include a link to the repo, use emoji sparsely." />
                        </div>
                        <Button className="bg-[var(--primary)] text-[var(--primary-foreground)] font-bold h-11 px-6 rounded-xl border-none">Update AI Persona</Button>
                    </Card>
                </section>

                {/* Integrations */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-zinc-400 tracking-widest pl-1">
                        <Shield size={14} className="text-[var(--hero)]" /> Connected Accounts
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-none bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <Github className="text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-[var(--foreground)]">GitHub</div>
                                    <div className="flex items-center gap-1 text-[var(--primary)] text-xs font-bold">
                                        <CheckCircle2 size={12} /> Connected
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-xl font-bold border-zinc-200">Disconnect</Button>
                        </Card>
                        <Card className="border-none bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-[#1DA1F2] flex items-center justify-center">
                                    <Twitter className="text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-[var(--foreground)]">X (Twitter)</div>
                                    <div className="flex items-center gap-1 text-[var(--primary)] text-xs font-bold">
                                        <CheckCircle2 size={12} /> Connected
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-xl font-bold border-zinc-200">Refresh Session</Button>
                        </Card>
                    </div>
                </section>

                {/* Billing */}
                <Card className="border-none bg-zinc-900 rounded-[3rem] p-10 text-white relative overflow-hidden mt-6">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-2">
                            <Badge className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)] font-bold mb-2">Pro Member</Badge>
                            <h3 className="text-3xl font-extrabold tracking-tight">Your Pro subscription is active.</h3>
                            <p className="text-white/50 font-medium">Next billing date: November 24, 2024</p>
                        </div>
                        <div className="flex gap-4">
                            <Button className="bg-white/10 hover:bg-white/20 text-white font-bold h-14 px-8 rounded-2xl border-white/20" variant="outline">Manage Billing</Button>
                            <Button className="bg-[var(--hero)] text-white font-bold h-14 px-8 rounded-2xl border-none">Cancel Plan</Button>
                        </div>
                    </div>
                    <div className="absolute -top-12 -right-12 h-64 w-64 bg-[var(--hero)]/20 rounded-full blur-[100px]"></div>
                </Card>
            </div>
        </div>
    );
}
