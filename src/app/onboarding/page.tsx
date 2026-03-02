"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Github, ArrowRight, Loader2, Lock, Globe, Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface Repo {
    id: string;
    full_name: string;
    updated_at: string;
    private?: boolean;
}

export default function OnboardingWizard() {
    const router = useRouter();
    const { user, isLoaded, isSignedIn } = useUser();
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(true); // initial status check
    const [saving, setSaving] = useState(false);

    // Repo selection state
    const [repos, setRepos] = useState<Repo[]>([]);
    const [reposLoading, setReposLoading] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
    const [repoSearch, setRepoSearch] = useState("");

    // Check auth
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push("/login");
        }
    }, [isLoaded, isSignedIn, router]);

    // Check onboarding status to determine which step to show
    const checkStatus = useCallback(async () => {
        try {
            const res = await fetch("/api/onboarding/status");
            if (!res.ok) return;
            const data = await res.json();

            if (data.hasGithub && data.hasRepo) {
                // Already fully onboarded
                router.push("/dashboard");
                return;
            }

            if (data.hasGithub) {
                // GitHub connected but no repo — jump to step 2
                setStep(2);
                fetchRepos();
            } else {
                setStep(1);
            }
        } catch (err) {
            console.error("Status check failed:", err);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            checkStatus();
        }
    }, [isLoaded, isSignedIn, checkStatus]);

    // Fetch repos from GitHub
    const fetchRepos = async () => {
        setReposLoading(true);
        try {
            const res = await fetch("/api/github/repos");
            if (!res.ok) throw new Error("Failed to fetch repos");
            const data = await res.json();
            setRepos(data);
        } catch {
            toast.error("Failed to load repositories. Please try again.");
        } finally {
            setReposLoading(false);
        }
    };

    // Connect GitHub via Clerk
    const handleConnectGithub = async () => {
        if (!user) return;
        try {
            const externalAccount = await user.createExternalAccount({
                strategy: "oauth_github",
                redirectUrl: window.location.origin + "/onboarding",
                additionalScopes: ["repo"],
            });

            // Clerk returns a verification URL we must redirect to
            const redirectUrl = externalAccount.verification?.externalVerificationRedirectURL;
            if (redirectUrl) {
                window.location.href = redirectUrl.toString();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to initiate GitHub connection");
        }
    };

    // Complete onboarding
    const handleComplete = async () => {
        if (!selectedRepo) {
            toast.error("Please select a repository.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/onboarding/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    repoId: selectedRepo.id,
                    repoName: selectedRepo.full_name
                })
            });

            if (!res.ok) throw new Error("Failed to complete onboarding");

            toast.success("Repository connected! Redirecting to dashboard...");
            router.push("/dashboard");
        } catch (error) {
            console.error("Onboarding error:", error);
            toast.error("Something went wrong. Please try again.");
            setSaving(false);
        }
    };

    // Filter repos by search
    const filteredRepos = repos.filter(r =>
        r.full_name.toLowerCase().includes(repoSearch.toLowerCase())
    );

    const totalSteps = 2;

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#9CA3AF]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center pt-24 pb-12 px-4 relative overflow-hidden">
            {/* Progress bar */}
            <div className="absolute top-0 w-full h-1 bg-[#E5E7EB] z-20">
                <div
                    className="h-full bg-[#111111] transition-all duration-500 ease-in-out"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                />
            </div>

            <div className="w-full max-w-xl relative z-10">
                <div className="rounded-2xl overflow-hidden flex flex-col border border-[#E5E7EB] bg-white shadow-sm">
                    {/* Top bar */}
                    <div className="p-5 md:px-10 border-b border-[#E5E7EB] bg-[#FAFAFA] flex justify-between items-center">
                        <span className="font-bold text-lg tracking-tight text-[#111111]">ShipInPublic</span>
                        <div className="inline-block bg-[#F3F4F6] text-[#111111] border border-[#E5E7EB] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest">
                            Step {step} of {totalSteps}
                        </div>
                    </div>

                    <div className="p-8 md:p-10 min-h-[420px] flex flex-col">
                        {/* ======================== STEP 1: Connect GitHub ======================== */}
                        {step === 1 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                                <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center mb-6">
                                    <Github className="w-8 h-8 text-[#111111]" />
                                </div>
                                <h2 className="text-2xl font-bold text-[#111111] mb-3 tracking-tight">
                                    Connect your GitHub
                                </h2>
                                <p className="text-[#6B7280] text-sm max-w-sm mb-8 leading-relaxed">
                                    ShipInPublic needs access to your repositories to detect activity and generate posts. We only read metadata — your source code stays private.
                                </p>
                                <Button
                                    className="bg-[#111111] text-white hover:bg-[#333333] rounded-full px-8 py-3 h-auto text-base font-semibold flex items-center gap-3 transition-colors"
                                    onClick={handleConnectGithub}
                                >
                                    <Github className="w-5 h-5" />
                                    Connect GitHub
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        {/* ======================== STEP 2: Select Repository ======================== */}
                        {step === 2 && (
                            <div className="flex-1 flex flex-col animate-in fade-in duration-500">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-[#111111] mb-2 tracking-tight">
                                        Select a repository
                                    </h2>
                                    <p className="text-[#6B7280] text-sm">
                                        Choose which repo to track for #BuildInPublic updates.
                                    </p>
                                </div>

                                {/* Search */}
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                                    <Input
                                        placeholder="Search repositories..."
                                        className="pl-9 bg-white border-[#E5E7EB] text-[#111111] rounded-lg h-10 focus-visible:ring-1 focus-visible:ring-[#111111]"
                                        value={repoSearch}
                                        onChange={(e) => setRepoSearch(e.target.value)}
                                    />
                                </div>

                                {/* Repo list */}
                                <div className="flex-1 border border-[#E5E7EB] rounded-xl overflow-hidden">
                                    <div className="max-h-[280px] overflow-y-auto divide-y divide-[#E5E7EB]">
                                        {reposLoading ? (
                                            <div className="flex items-center justify-center py-16">
                                                <Loader2 className="w-5 h-5 animate-spin text-[#9CA3AF]" />
                                                <span className="ml-2 text-sm text-[#6B7280]">Loading repos...</span>
                                            </div>
                                        ) : filteredRepos.length === 0 ? (
                                            <div className="text-center py-16 px-4">
                                                <p className="text-[#6B7280] text-sm">
                                                    {repoSearch ? "No repos match your search." : "No repositories found."}
                                                </p>
                                            </div>
                                        ) : (
                                            filteredRepos.map((repo) => {
                                                const isSelected = selectedRepo?.id === repo.id;
                                                return (
                                                    <button
                                                        key={repo.id}
                                                        className={`w-full text-left px-4 py-3.5 flex items-center gap-3 transition-colors ${isSelected
                                                            ? "bg-[#F3F4F6]"
                                                            : "bg-white hover:bg-[#FAFAFA]"
                                                            }`}
                                                        onClick={() => setSelectedRepo(repo)}
                                                    >
                                                        {isSelected ? (
                                                            <CheckCircle2 className="w-5 h-5 text-[#111111] shrink-0" />
                                                        ) : (
                                                            <div className="w-5 h-5 rounded-full border-2 border-[#E5E7EB] shrink-0" />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm font-medium truncate ${isSelected ? "text-[#111111]" : "text-[#374151]"}`}>
                                                                {repo.full_name}
                                                            </p>
                                                        </div>
                                                        {repo.private !== undefined && (
                                                            <span className={`shrink-0 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${repo.private
                                                                ? "bg-[#F3F4F6] text-[#6B7280]"
                                                                : "bg-[#F3F4F6] text-[#9CA3AF]"
                                                                }`}>
                                                                {repo.private ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                                                                {repo.private ? "Private" : "Public"}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                {/* Continue button */}
                                <Button
                                    className="mt-5 w-full bg-[#111111] text-white hover:bg-[#333333] rounded-full h-12 text-base font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
                                    onClick={handleComplete}
                                    disabled={!selectedRepo || saving}
                                >
                                    {saving ? (
                                        <>Connecting... <Loader2 className="w-4 h-4 animate-spin" /></>
                                    ) : (
                                        <>Continue <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
