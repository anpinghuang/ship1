"use client";

import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Search, Zap, Clock, CheckCircle2, XCircle, Twitter, Trash2, Github, Loader2,
    Send, FileText, GitCommit, ExternalLink, Plus, X, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { usePosts, useDashboardStats, useCommits, useGeneratePost, useConnections, queryKeys } from "@/lib/hooks";

/* ─── Types ─── */

interface CommitData {
    sha: string;
    message: string;
    author: string | null;
    url: string;
    committedAt: string;
    repo?: string;
    projectId?: string;
    hasPost?: boolean;
    postCount?: number;
}

interface Post {
    id: string;
    content: string;
    status: string;
    variants: string[] | null;
    projectId: string | null;
    commitSha: string | null;
    project: { githubRepoName: string | null } | null;
    commit: CommitData | null;
    scheduledFor: string | null;
    createdAt: string;
    updatedAt: string;
}

const statusIcon: Record<string, any> = {
    DRAFT: <FileText className="w-3 h-3" />,
    SCHEDULED: <Clock className="w-3 h-3" />,
    PUBLISHED: <CheckCircle2 className="w-3 h-3" />,
    FAILED: <XCircle className="w-3 h-3" />,
};
const statusLabel: Record<string, string> = {
    DRAFT: "Draft", SCHEDULED: "Scheduled", PUBLISHED: "Published", FAILED: "Failed",
};

/* ─── Component ─── */

export default function PostsPage() {
    const qc = useQueryClient();
    const [search, setSearch] = useState("");
    const [repoFilter, setRepoFilter] = useState("all");

    // React Query: posts & projects (cached)
    const { data: postsData, isLoading } = usePosts(repoFilter);
    const { data: statsData } = useDashboardStats();
    const posts = postsData ?? [];
    const projects = statsData?.projects ?? [];

    // Edit modal
    const [editOpen, setEditOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [editContent, setEditContent] = useState("");
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Variant system
    const [allVersions, setAllVersions] = useState<string[]>([]);
    const [activeVersionIndex, setActiveVersionIndex] = useState(0);
    const [isGeneratingMore, setIsGeneratingMore] = useState(false);

    // Generate modal
    const [genOpen, setGenOpen] = useState(false);
    const { data: commits = [], isLoading: commitsLoading, refetch: refetchCommits } = useCommits(repoFilter, genOpen);
    const [generatingSha, setGeneratingSha] = useState<string | null>(null);
    const generatePostMutation = useGeneratePost();
    const { data: connections } = useConnections();

    const githubConnected = connections?.github?.connected ?? false;
    const twitterConnected = connections?.twitter?.connected ?? false;

    const filteredPosts = posts.filter((p: Post) =>
        p.content.toLowerCase().includes(search.toLowerCase()) ||
        (p.commit?.message || "").toLowerCase().includes(search.toLowerCase())
    );

    /* ─── Generate flow ─── */

    const openGenerate = () => {
        setGenOpen(true);
        // React Query will automatically fetch if stale or first time
        refetchCommits();
    };

    const generateForCommit = async (sha: string) => {
        setGeneratingSha(sha);
        try {
            await generatePostMutation.mutateAsync(sha);
            toast.success("Draft generated!");
            setGenOpen(false);
        } catch (err: any) {
            toast.error(err.message || "Generation failed");
        } finally {
            setGeneratingSha(null);
        }
    };

    /* ─── Edit flow ─── */

    const openPost = (post: Post) => {
        setSelectedPost(post);
        setEditContent(post.content);
        // Build all versions: primary content + variants
        const versions = [post.content];
        if (post.variants && Array.isArray(post.variants)) {
            versions.push(...(post.variants as string[]));
        }
        setAllVersions(versions);
        setActiveVersionIndex(0);
        setEditOpen(true);
    };

    const closeEdit = () => { setEditOpen(false); setSelectedPost(null); };

    const switchVersion = (index: number) => {
        // Save current edits to the current version slot
        setAllVersions(prev => {
            const updated = [...prev];
            updated[activeVersionIndex] = editContent;
            return updated;
        });
        setActiveVersionIndex(index);
        setEditContent(allVersions[index]);
    };

    // Auto-save logic
    const autoSaveRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    useEffect(() => {
        if (!selectedPost || !editOpen || selectedPost.status !== "DRAFT") return;
        if (editContent === selectedPost.content) return;

        if (autoSaveRef.current) clearTimeout(autoSaveRef.current);

        autoSaveRef.current = setTimeout(async () => {
            setIsSaving(true);
            try {
                const res = await fetch("/api/posts", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ postId: selectedPost.id, content: editContent })
                });
                if (res.ok) {
                    await res.json();
                    qc.invalidateQueries({ queryKey: ["posts"] });
                    // Update selectedPost content reference for next comparison
                    setSelectedPost(prev => prev ? { ...prev, content: editContent } : prev);
                }
            } catch {
                // Silent
            } finally {
                setIsSaving(false);
            }
        }, 800);

        return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
    }, [editContent, selectedPost, editOpen]);

    // Generate more alternatives
    const generateMore = async () => {
        if (!selectedPost?.commitSha) {
            toast.error("No commit linked to generate from");
            return;
        }
        setIsGeneratingMore(true);
        try {
            const res = await fetch("/api/posts/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ commitSha: selectedPost.commitSha })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed");
            // Extract the generated content + variants and append
            const newVersions: string[] = [];
            if (data.content) newVersions.push(data.content);
            if (data.variants && Array.isArray(data.variants)) {
                newVersions.push(...data.variants);
            }
            if (newVersions.length > 0) {
                setAllVersions(prev => {
                    const updated = [...prev];
                    updated[activeVersionIndex] = editContent; // save current edits
                    return [...updated, ...newVersions];
                });
                toast.success(`${newVersions.length} new version${newVersions.length > 1 ? "s" : ""} generated!`);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to generate");
        } finally {
            setIsGeneratingMore(false);
        }
    };

    const handleAction = async (action: "SCHEDULE" | "PUBLISH") => {
        if (!selectedPost) return;
        setIsActionLoading(true);
        try {
            const res = await fetch("/api/posts/action", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: selectedPost.id, action })
            });
            if (!res.ok) throw new Error();
            toast.success(action === "PUBLISH" ? "Published!" : "Scheduled!");
            qc.invalidateQueries({ queryKey: ["posts"] });
            qc.invalidateQueries({ queryKey: queryKeys.dashboardStats });
            closeEdit();
        } catch { toast.error(`Failed`); }
        finally { setIsActionLoading(false); }
    };

    const handleDelete = async () => {
        if (!selectedPost) return;
        setIsActionLoading(true);
        try {
            const res = await fetch(`/api/posts?postId=${selectedPost.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            toast.success("Post deleted!");
            qc.invalidateQueries({ queryKey: ["posts"] });
            qc.invalidateQueries({ queryKey: queryKeys.dashboardStats });
            closeEdit();
        } catch {
            toast.error("Failed to delete post.");
        } finally {
            setIsActionLoading(false);
        }
    };

    /* ─── Render ─── */

    return (
        <div className="space-y-6 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#111111]">Posts</h1>
                    <p className="text-[#6B7280] mt-1">Generate, review, and publish from your commits.</p>
                </div>
                {githubConnected ? (
                    <Button
                        className="bg-[#111111] text-white hover:bg-[#333333] rounded-full font-medium px-5 h-10"
                        onClick={openGenerate}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Create Post
                    </Button>
                ) : (
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-[#9CA3AF]">Connect GitHub to create posts</span>
                        <Button size="sm" className="h-8 px-4 text-xs bg-[#111111] text-white hover:bg-[#333333] rounded-lg font-semibold" asChild>
                            <a href="/dashboard/settings"><Github className="w-3 h-3 mr-1.5" /> Connect GitHub</a>
                        </Button>
                    </div>
                )}
            </div>

            {/* Search + filter */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                    <Input
                        placeholder="Search posts or commits..."
                        className="pl-9 bg-white border-[#E5E7EB] rounded-lg h-10 text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={repoFilter} onValueChange={setRepoFilter}>
                    <SelectTrigger className="w-[180px] bg-white border-[#E5E7EB] rounded-lg h-10 text-sm">
                        <SelectValue placeholder="All repos" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#E5E7EB]">
                        <SelectItem value="all">All repos</SelectItem>
                        {projects.map((p: any) => (
                            <SelectItem key={p.id} value={p.id}>
                                {p.githubRepoName || "Unknown"}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Post list */}
            {isLoading ? (
                <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-[76px] bg-[#F3F4F6] rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-[#E5E7EB] rounded-xl bg-white">
                    <FileText className="w-10 h-10 text-[#E5E7EB] mx-auto mb-4" />
                    <p className="text-sm text-[#6B7280]">{search ? "No posts match your search" : "No posts yet"}</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">Click &quot;Create Post&quot; to generate a post from a recent commit.</p>
                </div>
            ) : (
                <div className="space-y-2 stagger-children">
                    {filteredPosts.map(post => (
                        <div
                            key={post.id}
                            className="bg-white border border-[#E5E7EB] rounded-xl p-4 hover:border-[#D1D5DB] transition-colors flex items-center gap-3"
                        >
                            <button
                                className="flex-1 min-w-0 text-left"
                                onClick={() => openPost(post)}
                            >
                                <p className="text-sm text-[#111111] font-medium truncate">{post.content}</p>
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                    {post.project?.githubRepoName && (
                                        <span className="text-[10px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                            <Github className="w-3 h-3" /> {post.project.githubRepoName}
                                        </span>
                                    )}
                                    {post.commit && (
                                        <span className="text-[10px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-full font-mono">
                                            {post.commit.sha.slice(0, 7)}
                                        </span>
                                    )}
                                    {post.commit && (
                                        <span className="text-[10px] text-[#9CA3AF] truncate max-w-[200px]">
                                            {post.commit.message.split("\n")[0]}
                                        </span>
                                    )}
                                    <span className="text-[10px] text-[#9CA3AF] font-mono ml-auto shrink-0">{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </button>
                            <span className="shrink-0 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6B7280] bg-[#F3F4F6] border border-[#E5E7EB] px-2.5 py-1 rounded-full">
                                {statusIcon[post.status]} {statusLabel[post.status]}
                            </span>
                            <button
                                className="shrink-0 p-1.5 rounded-lg text-[#D1D5DB] hover:text-red-500 hover:bg-red-50 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toast.success("Deleted");
                                    fetch(`/api/posts?postId=${post.id}`, { method: "DELETE" }).then(() => {
                                        qc.invalidateQueries({ queryKey: ["posts"] });
                                        qc.invalidateQueries({ queryKey: queryKeys.dashboardStats });
                                    }).catch(() => {
                                        toast.error("Delete failed");
                                    });
                                }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* ════════════════ GENERATE MODAL ════════════════ */}
            <Dialog open={genOpen} onOpenChange={(o) => { if (!o) setGenOpen(false); }}>
                <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[85vh] overflow-y-auto overflow-x-hidden flex flex-col bg-white border border-[#E5E7EB] rounded-2xl p-0 gap-0 shadow-xl">
                    <div className="p-6 pb-4 border-b border-[#E5E7EB] shrink-0">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-[#111111]">Generate from Commit</DialogTitle>
                        </DialogHeader>
                        <p className="text-xs text-[#6B7280] mt-1">Pick a commit to generate a #BuildInPublic draft post.</p>
                    </div>

                    <div className="divide-y divide-[#E5E7EB]">
                        {commitsLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="w-5 h-5 animate-spin text-[#9CA3AF] mr-2" />
                                <span className="text-sm text-[#6B7280]">Fetching commits...</span>
                            </div>
                        ) : commits.length === 0 ? (
                            <div className="text-center py-16">
                                <GitCommit className="w-8 h-8 text-[#E5E7EB] mx-auto mb-3" />
                                <p className="text-sm text-[#6B7280]">No recent commits found</p>
                            </div>
                        ) : (
                            commits.map((c: any) => (
                                <div key={c.sha} className="px-6 py-4 flex items-center gap-4 hover:bg-[#FAFAFA] transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {c.repo && (
                                                <span className="text-[10px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                                    <Github className="w-3 h-3" /> {c.repo}
                                                </span>
                                            )}
                                            <span className="text-[10px] font-mono text-[#9CA3AF]">{c.sha.slice(0, 7)}</span>
                                            <span className="text-[10px] text-[#9CA3AF]">·</span>
                                            <span className="text-[10px] text-[#9CA3AF]">{new Date(c.committedAt).toLocaleDateString()}</span>
                                            {c.hasPost && (
                                                <span className="text-[10px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-full font-semibold">
                                                    {c.postCount} post{(c.postCount || 0) > 1 ? "s" : ""}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-[#111111] truncate">{c.message.split("\n")[0]}</p>
                                        {c.author && <p className="text-[10px] text-[#9CA3AF] mt-0.5">by {c.author}</p>}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 rounded-lg border-[#E5E7EB] text-[#111111] hover:bg-[#F3F4F6] text-xs font-medium shrink-0"
                                        onClick={() => generateForCommit(c.sha)}
                                        disabled={generatingSha !== null}
                                    >
                                        {generatingSha === c.sha
                                            ? <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                            : <Zap className="w-3 h-3 mr-1" />
                                        }
                                        {c.hasPost ? "Another" : "Generate"}
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* ════════════════ EDIT MODAL ════════════════ */}
            <Dialog open={editOpen} onOpenChange={(o) => { if (!o) closeEdit(); }}>
                <DialogContent
                    showCloseButton={false}
                    className="sm:max-w-[960px] w-[95vw] max-h-[85vh] overflow-hidden flex flex-col bg-white border border-[#E5E7EB] rounded-2xl p-0 gap-0 shadow-xl"
                >
                    {/* ── Fixed Header ── */}
                    <div className="shrink-0 border-b border-[#E5E7EB] bg-[#FAFAFA] rounded-t-2xl">
                        <DialogTitle className="sr-only">Edit Post</DialogTitle>
                        <div className="flex items-center justify-between gap-4 px-6 py-5 md:px-8">
                            {/* Left: Title + Status */}
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="text-lg font-bold text-[#111111] whitespace-nowrap">Edit Post</span>
                                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6B7280] bg-white border border-[#E5E7EB] shadow-sm px-2.5 py-1 rounded-full whitespace-nowrap">
                                    {selectedPost && statusIcon[selectedPost.status]} {selectedPost && statusLabel[selectedPost.status]}
                                </span>
                                {isSaving && (
                                    <span className="text-xs text-[#9CA3AF] font-medium whitespace-nowrap">Saving...</span>
                                )}
                            </div>

                            {/* Right: Actions + Close */}
                            <div className="flex items-center gap-3 shrink-0">
                                {(selectedPost?.status === "DRAFT" || selectedPost?.status === "SCHEDULED") && (
                                    twitterConnected ? (
                                        <Button
                                            className="h-9 bg-[#111111] text-white hover:bg-[#333333] rounded-lg px-5 text-sm font-semibold shadow-sm"
                                            onClick={() => handleAction("PUBLISH")}
                                            disabled={isActionLoading || isSaving}
                                        >
                                            {isActionLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Send className="w-4 h-4 mr-1" />}
                                            Publish
                                        </Button>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-[#9CA3AF] whitespace-nowrap">Connect X to publish</span>
                                            <Button size="sm" className="h-7 px-3 text-[10px] bg-[#111111] text-white hover:bg-[#333333] rounded-lg font-semibold" asChild>
                                                <a href="/dashboard/settings"><Twitter className="w-3 h-3 mr-1" /> Connect</a>
                                            </Button>
                                        </div>
                                    )
                                )}
                                <button
                                    onClick={closeEdit}
                                    className="p-2 rounded-lg text-[#9CA3AF] hover:text-[#111111] hover:bg-[#F3F4F6] transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Commit context */}
                        {selectedPost?.commit && (
                            <div className="px-6 pb-5 md:px-8">
                                <a
                                    href={selectedPost.commit.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 p-3.5 bg-white border border-[#E5E7EB] shadow-sm rounded-xl hover:border-[#D1D5DB] transition-all group"
                                >
                                    <GitCommit className="w-4 h-4 text-[#6B7280] shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {selectedPost.project?.githubRepoName && (
                                                <span className="text-[10px] font-medium text-[#6B7280]">{selectedPost.project.githubRepoName}</span>
                                            )}
                                            <span className="text-[10px] font-mono text-[#9CA3AF]">{selectedPost.commit.sha.slice(0, 7)}</span>
                                            <span className="text-[10px] text-[#9CA3AF]">{new Date(selectedPost.commit.committedAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-[#374151] font-medium truncate">{selectedPost.commit.message.split("\n")[0]}</p>
                                        {selectedPost.commit.author && (
                                            <p className="text-[10px] text-[#9CA3AF] mt-0.5">by {selectedPost.commit.author}</p>
                                        )}
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#6B7280] shrink-0 mt-0.5" />
                                </a>
                            </div>
                        )}
                    </div>

                    {/* ── Scrollable Body ── */}
                    <div className="flex-1 flex flex-col lg:flex-row lg:divide-x lg:divide-[#E5E7EB] min-h-0 overflow-hidden">
                        {/* Left: Variants + Editor (scrollable) */}
                        <div className="flex-1 min-w-0 overflow-y-auto p-6 md:p-8 space-y-6">
                            {/* Variants */}
                            {selectedPost?.status === "DRAFT" && allVersions.length > 1 && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Versions</span>
                                        {selectedPost?.commitSha && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 px-3 rounded-lg border-[#E5E7EB] text-[#6B7280] hover:text-[#111111] hover:bg-[#F3F4F6] text-xs font-medium"
                                                onClick={generateMore}
                                                disabled={isGeneratingMore}
                                            >
                                                {isGeneratingMore
                                                    ? <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                                    : <RefreshCw className="w-3 h-3 mr-1" />
                                                }
                                                Generate more
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {allVersions.map((v, i) => (
                                            <button
                                                key={i}
                                                onClick={() => switchVersion(i)}
                                                className={`text-left text-xs px-3 py-2.5 rounded-lg border transition-all leading-relaxed whitespace-pre-wrap break-words max-w-full ${i === activeVersionIndex
                                                    ? "border-[#111111] bg-[#111111]/5 text-[#111111] shadow-sm"
                                                    : "border-[#E5E7EB] bg-[#FAFAFA] text-[#6B7280] hover:border-[#D1D5DB] hover:text-[#374151]"
                                                    }`}
                                            >
                                                <span className="font-semibold text-[10px] uppercase tracking-wider opacity-60 block mb-1">V{i + 1}</span>
                                                <span className="line-clamp-2">{v}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Generate more when no variants yet */}
                            {selectedPost?.status === "DRAFT" && allVersions.length <= 1 && selectedPost?.commitSha && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-4 rounded-lg border-[#E5E7EB] text-[#6B7280] hover:text-[#111111] hover:bg-[#F3F4F6] text-xs font-medium"
                                    onClick={generateMore}
                                    disabled={isGeneratingMore}
                                >
                                    {isGeneratingMore
                                        ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                                        : <RefreshCw className="w-3 h-3 mr-1.5" />
                                    }
                                    Generate alternatives
                                </Button>
                            )}

                            {/* Editor */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Content</span>
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F3F4F6] ${editContent.length > 280 ? "text-red-500" : "text-[#6B7280]"}`}>
                                        {editContent.length} / 280
                                    </span>
                                </div>
                                <Textarea
                                    className="min-h-[140px] text-sm resize-none border-[#E5E7EB] bg-white text-[#111111] rounded-lg focus-visible:ring-1 focus-visible:ring-[#111111]"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Right: Preview (sticky, no scroll) */}
                        <div className="lg:w-[340px] shrink-0 p-6 md:p-8 bg-[#FAFAFA] lg:bg-white overflow-hidden">
                            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block mb-3">Preview</span>
                            <div className="p-4 rounded-xl border border-[#E5E7EB] bg-white lg:bg-[#FAFAFA]">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center shrink-0 border border-[#E5E7EB]">
                                        <Twitter className="w-4 h-4 text-[#111111]" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-[#111111] text-sm">You</span>
                                            <span className="text-[10px] text-[#9CA3AF]">now</span>
                                        </div>
                                        <p className="text-[#374151] mt-1.5 whitespace-pre-wrap text-sm leading-relaxed break-words">{editContent || "..."}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
