"use client";

import { useProjects, useUpdateProjectSettings, useGithubRepos, useAddProject, useDeleteProject, useBackfillCommits } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Bot, User, Github, Plus, Loader2, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function AutomationSettingsPage() {
    const { data: projects, isLoading } = useProjects();
    const updateSettings = useUpdateProjectSettings();
    const deleteProject = useDeleteProject();
    const backfillMutation = useBackfillCommits();

    // Add Repo Modal State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const { data: repos, isLoading: isReposLoading } = useGithubRepos(isAddOpen);
    const addProject = useAddProject();
    const [addingRepoId, setAddingRepoId] = useState<string | null>(null);

    const handleAddRepo = async (repoId: string, repoName: string) => {
        setAddingRepoId(repoId);
        addProject.mutate(
            { githubRepoId: repoId, githubRepoName: repoName },
            {
                onSuccess: () => {
                    toast.success(`Now tracking ${repoName}`);
                    setAddingRepoId(null);
                    setIsAddOpen(false);
                },
                onError: (err: any) => {
                    toast.error(err.message || "Failed to add repository");
                    setAddingRepoId(null);
                }
            }
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse w-full">
                <div className="h-8 w-48 bg-[#F3F4F6] rounded-lg mb-2" />
                <div className="h-4 w-96 bg-[#F3F4F6] rounded-lg mb-8" />
                <div className="h-64 bg-[#F3F4F6] rounded-xl" />
            </div>
        );
    }

    const hasProjects = projects && projects.length > 0;

    return (
        <div className="space-y-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#111111]">Automation</h1>
                    <p className="text-[#6B7280] mt-1">Configure how ShipInPublic translates your work into posts per repository.</p>
                </div>
                <Button onClick={() => setIsAddOpen(true)} className="gap-2 shrink-0">
                    <Plus className="w-4 h-4" /> Add Repository
                </Button>
            </div>

            {!hasProjects ? (
                <div className="text-center py-16 px-4 border border-[#E5E7EB] bg-white rounded-xl">
                    <Github className="w-10 h-10 text-[#E5E7EB] mx-auto mb-3" />
                    <p className="text-sm font-medium text-[#111111]">No repositories tracked yet.</p>
                    <p className="text-sm text-[#6B7280] mt-1 mb-4">Click "Add Repository" to start automating your workflow.</p>
                    <Button onClick={() => setIsAddOpen(true)} variant="outline" className="gap-2">
                        <Plus className="w-4 h-4" /> Track a Repository
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {projects.map((project: any) => (
                        <Card key={project.id} className="shadow-none border border-[#E5E7EB] bg-white rounded-xl overflow-hidden">
                            <CardHeader className="bg-[#FAFAFA] border-b border-[#E5E7EB] py-4 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-base font-semibold text-[#111111] flex items-center gap-2">
                                    <Github className="w-4 h-4 text-[#6B7280]" />
                                    {project.githubRepoName}
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => {
                                        if (confirm(`Are you sure you want to stop tracking ${project.githubRepoName}?`)) {
                                            deleteProject.mutate(project.id, {
                                                onSuccess: () => toast.success("Repository untracked."),
                                                onError: () => toast.error("Failed to untrack repository")
                                            });
                                        }
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Untrack
                                </Button>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-[#111111] mb-1 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-[#6B7280]" /> Draft Generation Workflow
                                        </h3>
                                        <p className="text-xs text-[#6B7280]">
                                            Choose how you want draft posts created when new commits are pushed to this repository.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        {/* Manual Option */}
                                        <Label
                                            htmlFor={`manual-${project.id}`}
                                            onClick={() => {
                                                if (!project.autoDrafts) return;
                                                updateSettings.mutate(
                                                    { id: project.id, autoDrafts: false },
                                                    {
                                                        onSuccess: () => toast.success("Draft setting updated."),
                                                        onError: () => toast.error("Failed to update setting.")
                                                    }
                                                );
                                            }}
                                            className={`cursor-pointer group relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all ${!project.autoDrafts
                                                ? "border-[#111111] bg-[#FAFAFA] ring-1 ring-[#111111]"
                                                : "border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#FAFAFA]"
                                                }`}
                                        >
                                            <div className="flex w-full items-center justify-between">
                                                <div className="flex items-center gap-2 font-semibold text-[#111111] text-sm">
                                                    <User className="w-4 h-4 text-[#6B7280]" /> Manual Drafting
                                                </div>
                                                {!project.autoDrafts && <div className="h-2 w-2 rounded-full bg-[#111111]" />}
                                            </div>
                                            <p className="text-xs text-[#6B7280] leading-relaxed">
                                                Commits appear in your feed as "Undrafted". You manually click "Generate Draft" on the ones you want to share. Best for granular control.
                                            </p>
                                        </Label>

                                        {/* Auto Option */}
                                        <Label
                                            htmlFor={`auto-${project.id}`}
                                            onClick={() => {
                                                if (project.autoDrafts) return;
                                                updateSettings.mutate(
                                                    { id: project.id, autoDrafts: true },
                                                    {
                                                        onSuccess: () => toast.success("Draft setting updated."),
                                                        onError: () => toast.error("Failed to update setting.")
                                                    }
                                                );
                                            }}
                                            className={`cursor-pointer group relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all ${project.autoDrafts
                                                ? "border-blue-600 bg-blue-50/30 ring-1 ring-blue-600"
                                                : "border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#FAFAFA]"
                                                }`}
                                        >
                                            <div className="flex w-full items-center justify-between">
                                                <div className="flex items-center gap-2 font-semibold text-[#111111] text-sm">
                                                    <Bot className="w-4 h-4 text-[#6B7280]" /> Automatic Drafting
                                                </div>
                                                {project.autoDrafts && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                                            </div>
                                            <p className="text-xs text-[#6B7280] leading-relaxed">
                                                Our AI instantly generates a post draft every time you push a substantive commit. They await your review in the Posts tab.
                                            </p>
                                        </Label>
                                    </div>
                                </div>

                                <div className="mt-6 pt-5 border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="text-xs text-[#6B7280]">
                                        Missing history? Import up to 30 older commits from the past month.
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs shrink-0 bg-[#FAFAFA]"
                                        onClick={() => {
                                            const promise = backfillMutation.mutateAsync(project.id);
                                            toast.promise(promise, {
                                                loading: 'Importing historical commits...',
                                                success: 'Older commits imported successfully! Check your Posts tab.',
                                                error: 'Failed to import older commits.',
                                            });
                                        }}
                                        disabled={backfillMutation.isPending}
                                    >
                                        <Download className="w-3.5 h-3.5 mr-2" />
                                        Import Older Commits
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Repository Modal */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-2 border-b border-[#E5E7EB]">
                        <DialogTitle>Track New Repository</DialogTitle>
                    </DialogHeader>

                    <div className="p-6 overflow-y-auto flex-1">
                        {isReposLoading ? (
                            <div className="py-12 flex flex-col items-center justify-center text-[#6B7280]">
                                <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#111111]" />
                                <p className="text-sm">Fetching your GitHub repositories...</p>
                            </div>
                        ) : !repos || repos.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-[#6B7280]">No repositories found.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {repos.map((repo: any) => {
                                    const isTracked = projects?.some((p: any) => p.githubRepoId === repo.id);
                                    const isAdding = addingRepoId === repo.id;

                                    return (
                                        <div key={repo.id} className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg bg-[#FAFAFA]">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <Github className="w-5 h-5 text-[#6B7280] shrink-0" />
                                                <div className="truncate">
                                                    <p className="text-sm font-medium text-[#111111] truncate">{repo.full_name}</p>
                                                    {repo.private && <p className="text-xs text-[#6B7280] mt-0.5">Private</p>}
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant={isTracked ? "secondary" : "default"}
                                                disabled={isTracked || isAdding}
                                                onClick={() => handleAddRepo(repo.id, repo.full_name)}
                                                className="shrink-0 ml-3"
                                            >
                                                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : isTracked ? "Tracked" : "Track"}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
