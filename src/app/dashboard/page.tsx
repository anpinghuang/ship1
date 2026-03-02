"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Flame, Send, Github, FileText, GitCommit, RefreshCcw, Twitter,
    ExternalLink, Check, AlertCircle, Sparkles, Eye, BarChart3, MessageCircle
} from "lucide-react";
import { useDashboardStats, useConnections } from "@/lib/hooks";

export default function DashboardHome() {
    const { data: stats, isLoading: loading, refetch } = useDashboardStats();
    const { data: connections } = useConnections();
    const [repoFilter, setRepoFilter] = useState("all");

    const filteredCommits = stats?.commits?.filter(
        (c: any) => repoFilter === "all" || c.projectId === repoFilter
    ) || [];

    if (loading) {
        return (
            <div className="space-y-6 w-full">
                <div className="h-8 w-48 bg-[#F3F4F6] rounded-lg animate-pulse" />
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-24 bg-[#F3F4F6] rounded-xl animate-pulse" />
                    ))}
                </div>
                <div className="h-96 bg-[#F3F4F6] rounded-xl animate-pulse" />
            </div>
        );
    }

    const githubConnected = connections?.github?.connected ?? false;
    const twitterConnected = connections?.twitter?.connected ?? false;

    // Count undrafted commits that need action
    const undraftedCount = filteredCommits.filter((c: any) => c.status === "undrafted").length;

    return (
        <div className="space-y-6 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#111111]">Home</h1>
                    <p className="text-[#6B7280] mt-1">Your build-in-public command center.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={repoFilter} onValueChange={setRepoFilter}>
                        <SelectTrigger className="w-[200px] bg-white border-[#E5E7EB] rounded-lg text-sm">
                            <SelectValue placeholder="All repos" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#E5E7EB]">
                            <SelectItem value="all">All repositories</SelectItem>
                            {stats?.projects?.map((p: any) => (
                                <SelectItem key={p.id} value={p.id}>
                                    {p.githubRepoName || "Unknown"}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Connections card — only when something is disconnected */}
            {(!githubConnected || !twitterConnected) && (
                <Card className="shadow-none border border-[#E5E7EB] bg-white rounded-xl">
                    <CardContent className="p-0">
                        {!githubConnected && (
                            <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[#E5E7EB] last:border-b-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center border border-[#E5E7EB]">
                                        <Github className="w-4 h-4 text-[#6B7280]" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-[#111111]">GitHub</span>
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-0.5 rounded-full">
                                            <AlertCircle className="w-2.5 h-2.5" /> Not connected
                                        </span>
                                    </div>
                                </div>
                                <Button size="sm" className="h-8 px-4 text-xs bg-[#111111] text-white hover:bg-[#333333] rounded-lg font-semibold" asChild>
                                    <a href="/dashboard/settings"><Github className="w-3 h-3 mr-1.5" /> Connect</a>
                                </Button>
                            </div>
                        )}
                        {!twitterConnected && (
                            <div className="flex items-center justify-between gap-4 px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center border border-[#E5E7EB]">
                                        <Twitter className="w-4 h-4 text-[#6B7280]" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-[#111111]">X (Twitter)</span>
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-0.5 rounded-full">
                                            <AlertCircle className="w-2.5 h-2.5" /> Not connected
                                        </span>
                                    </div>
                                </div>
                                <Button size="sm" className="h-8 px-4 text-xs bg-[#111111] text-white hover:bg-[#333333] rounded-lg font-semibold" asChild>
                                    <a href="/dashboard/settings"><Twitter className="w-3 h-3 mr-1.5" /> Connect</a>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Stat cards — 5 columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                <Card className="shadow-none border border-[#E5E7EB] bg-white rounded-xl">
                    <CardContent className="pt-4 pb-3 px-5">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Drafts</span>
                            <FileText className="w-4 h-4 text-[#9CA3AF]" />
                        </div>
                        <div className="text-2xl font-bold text-[#111111] font-mono">{stats?.drafts ?? 0}</div>
                        <p className="text-[11px] text-[#9CA3AF] mt-0.5">Awaiting review</p>
                    </CardContent>
                </Card>

                <Card className="shadow-none border border-[#E5E7EB] bg-white rounded-xl">
                    <CardContent className="pt-4 pb-3 px-5">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Total Posts</span>
                            <Send className="w-4 h-4 text-[#9CA3AF]" />
                        </div>
                        <div className="text-2xl font-bold text-[#111111] font-mono">{stats?.publishedTotal ?? 0}</div>
                        <p className="text-[11px] text-[#9CA3AF] mt-0.5">Published</p>
                    </CardContent>
                </Card>

                <Card className="shadow-none border border-[#E5E7EB] bg-white rounded-xl">
                    <CardContent className="pt-4 pb-3 px-5">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Impressions</span>
                            <BarChart3 className="w-4 h-4 text-[#9CA3AF]" />
                        </div>
                        <div className="text-2xl font-bold text-[#111111] font-mono">{(stats?.totalImpressions ?? 0).toLocaleString()}</div>
                        <p className="text-[11px] text-[#9CA3AF] mt-0.5">Total</p>
                    </CardContent>
                </Card>

                <Card className="shadow-none border border-[#E5E7EB] bg-white rounded-xl">
                    <CardContent className="pt-4 pb-3 px-5">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Replies</span>
                            <MessageCircle className="w-4 h-4 text-[#9CA3AF]" />
                        </div>
                        <div className="text-2xl font-bold text-[#111111] font-mono">{(stats?.totalReplies ?? 0).toLocaleString()}</div>
                        <p className="text-[11px] text-[#9CA3AF] mt-0.5">Total</p>
                    </CardContent>
                </Card>

                <Card className="shadow-none border border-[#E5E7EB] bg-white rounded-xl col-span-2 md:col-span-1">
                    <CardContent className="pt-4 pb-3 px-5">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Streak</span>
                            <Flame className="w-4 h-4 text-[#9CA3AF]" />
                        </div>
                        <div className="text-2xl font-bold text-[#111111] font-mono">{stats?.streak ?? 0}<span className="text-sm font-medium text-[#6B7280] ml-1">days</span></div>
                        <p className="text-[11px] text-[#9CA3AF] mt-0.5">Consecutive</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Commits — full-width, action-driven */}
            <Card className="shadow-none border border-[#E5E7EB] bg-white rounded-xl">
                <CardHeader className="pb-3 border-b border-[#E5E7EB] flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CardTitle className="text-sm font-semibold text-[#111111] flex items-center gap-2">
                            <GitCommit className="w-4 h-4" /> Recent Commits
                        </CardTitle>
                        {undraftedCount > 0 && (
                            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                {undraftedCount} need drafts
                            </span>
                        )}
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#6B7280] hover:text-[#111111] h-7 text-xs" onClick={() => refetch()}>
                        <RefreshCcw className="w-3 h-3 mr-1" /> Refresh
                    </Button>
                </CardHeader>
                <CardContent className="pt-0 px-0">
                    {filteredCommits.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <Github className="w-10 h-10 text-[#E5E7EB] mx-auto mb-3" />
                            <p className="text-sm font-medium text-[#6B7280]">No commits yet</p>
                            <p className="text-xs text-[#9CA3AF] mt-1 max-w-sm mx-auto">
                                Push commits to your tracked repos and they will appear here with quick actions to generate drafts.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#E5E7EB]">
                            {filteredCommits.map((commit: any) => (
                                <div key={commit.sha} className={`px-5 py-4 flex items-center justify-between gap-4 hover:bg-[#FAFAFA] transition-colors ${commit.status === "undrafted" ? "bg-amber-50/30" : ""}`}>
                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                        {/* Status indicator */}
                                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${commit.status === "published" ? "bg-green-500" :
                                            commit.status === "drafted" ? "bg-blue-500" :
                                                "bg-amber-400"
                                            }`} />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-[#111111] font-medium truncate">{commit.message}</p>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-[11px] text-[#9CA3AF] font-mono">{commit.sha.slice(0, 7)}</span>
                                                <span className="text-[11px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-full font-medium">{commit.repo}</span>
                                                <span className="text-[11px] text-[#9CA3AF]">{new Date(commit.committedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status pill + action */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {commit.status === "published" ? (
                                            <>
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                                    <Check className="w-2.5 h-2.5" /> Published
                                                </span>
                                                <Button variant="ghost" size="sm" className="h-7 px-2 text-[#6B7280] hover:text-[#111111]" asChild>
                                                    <a href="/dashboard/posts"><Eye className="w-3.5 h-3.5" /></a>
                                                </Button>
                                            </>
                                        ) : commit.status === "drafted" ? (
                                            <>
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                                                    <FileText className="w-2.5 h-2.5" /> Drafted
                                                </span>
                                                <Button variant="outline" size="sm" className="h-7 px-3 text-xs border-[#E5E7EB] text-[#6B7280] hover:text-[#111111] rounded-lg" asChild>
                                                    <a href="/dashboard/posts">Open Draft</a>
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                                    <AlertCircle className="w-2.5 h-2.5" /> Undrafted
                                                </span>
                                                <Button size="sm" className="h-7 px-3 text-xs bg-[#111111] text-white hover:bg-[#333333] rounded-lg font-medium" asChild>
                                                    <a href="/dashboard/posts"><Sparkles className="w-3 h-3 mr-1" /> Generate Draft</a>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
