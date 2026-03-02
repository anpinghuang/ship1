"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Save, Webhook, Activity, Link as LinkIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useConnections, useSyncConnection, useDisconnectProvider, useProjects, useUpdateProjectSettings } from "@/lib/hooks";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
export default function SettingsPage() {
    const { user, isLoaded } = useUser();
    const searchParams = useSearchParams();
    const { data: connections, isLoading: connectionsLoading } = useConnections();
    const syncMutation = useSyncConnection();
    const disconnectMutation = useDisconnectProvider();
    const [connectingX, setConnectingX] = useState(false);
    const [connectingGithub, setConnectingGithub] = useState(false);

    // Optimistic UI for project settings
    const { data: projects } = useProjects();
    const updateProject = useUpdateProjectSettings();
    const primaryProject = projects?.[0]; // Settings apply to first project for now

    const handleToggle = (key: string, value: boolean) => {
        if (!primaryProject) return;
        updateProject.mutate(
            { id: primaryProject.id, [key]: value },
            {
                onSuccess: () => toast.success("Configuration updated.", { position: "top-center" }),
                onError: () => toast.error("Failed to update.", { position: "top-center" })
            }
        );
    };

    // After OAuth redirect back, sync the connection to DB
    useEffect(() => {
        if (!isLoaded || !user) return;

        // Check if we just returned from an OAuth redirect
        // by looking for newly connected external accounts that aren't in our DB yet
        const githubAccount = user.externalAccounts?.find(a => a.provider === "github");
        const xAccount = user.externalAccounts?.find(a => a.provider === "x");

        if (githubAccount && !connections?.github?.connected && !syncMutation.isPending) {
            syncMutation.mutate("github", {
                onSuccess: () => {
                    toast.success("GitHub connected successfully!");
                    setConnectingGithub(false);
                },
                onError: () => setConnectingGithub(false),
            });
        }

        if (xAccount && !connections?.twitter?.connected && !syncMutation.isPending) {
            syncMutation.mutate("x", {
                onSuccess: () => {
                    toast.success("X account connected successfully!");
                    setConnectingX(false);
                },
                onError: () => setConnectingX(false),
            });
        }
    }, [isLoaded, user, connections?.github?.connected, connections?.twitter?.connected]);

    // No manual save needed; updates are optimistic and instant.

    /* ─── Connect handlers ─── */

    const handleConnect = async (provider: "github" | "x") => {
        if (!user) return;
        const setLoading = provider === "github" ? setConnectingGithub : setConnectingX;
        setLoading(true);

        try {
            const strategy = provider === "github" ? "oauth_github" : "oauth_x";
            const externalAccount = await user.createExternalAccount({
                strategy,
                redirectUrl: "/dashboard/settings",
            });

            if (externalAccount.verification?.status === "unverified" && externalAccount.verification.externalVerificationRedirectURL) {
                window.location.href = externalAccount.verification.externalVerificationRedirectURL.href;
            } else {
                // Already verified — sync to DB
                syncMutation.mutate(provider, {
                    onSuccess: () => {
                        toast.success(`${provider === "github" ? "GitHub" : "X"} connected!`);
                        setLoading(false);
                    },
                    onError: () => setLoading(false),
                });
            }
        } catch (error: any) {
            console.error(error);
            const msg = error?.errors?.[0]?.longMessage || `Failed to connect ${provider}.`;
            if (msg.includes("verification")) {
                toast.error("Session too old. Please sign out and back in, then try again.");
            } else {
                toast.error(msg);
            }
            setLoading(false);
        }
    };

    /* ─── Disconnect handlers ─── */

    const handleDisconnect = async (provider: "github" | "x") => {
        disconnectMutation.mutate(provider, {
            onSuccess: () => toast.success(`${provider === "github" ? "GitHub" : "X"} disconnected.`),
            onError: () => toast.error(`Failed to disconnect ${provider}.`),
        });
    };

    // Status derived from DB-backed connections data
    const githubConnected = connections?.github?.connected ?? false;
    const xConnected = connections?.twitter?.connected ?? false;
    const githubUsername = connections?.github?.username;
    const xUsername = connections?.twitter?.username;

    return (
        <div className="space-y-8 w-full">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#111111]">System Configuration</h1>
                <p className="text-[#6B7280] mt-1">Manage external connections, webhooks, and operating preferences.</p>
            </div>

            <div className="grid gap-6">
                <Card className="border-[#E5E7EB] shadow-none bg-white rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-[#E5E7EB] bg-[#FAFAFA] pb-4">
                        <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider text-[#6B7280] font-semibold">
                            <Webhook className="w-4 h-4" /> Connected Integrations
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        {/* GitHub */}
                        <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-md bg-[#FAFAFA]">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex flex-col items-center justify-center border ${githubConnected ? 'bg-[#F3F4F6] border-[#111111]' : 'bg-[#F3F4F6] border-[#E5E7EB]'}`}>
                                    <Github className={`w-5 h-5 ${githubConnected ? 'text-[#111111]' : 'text-[#6B7280]'}`} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#111111] font-mono text-sm leading-tight">GITHUB_AUTH</h4>
                                    {connectionsLoading ? (
                                        <p className="text-xs text-[#9CA3AF] mt-1 tracking-wide">Loading...</p>
                                    ) : githubConnected ? (
                                        <p className="text-xs text-[#6B7280] mt-1 tracking-wide">Connected: <span className="font-semibold text-[#111111]">@{githubUsername || "Authorized User"}</span></p>
                                    ) : (
                                        <p className="text-xs text-[#6B7280] mt-1 tracking-wide">Status: <span className="font-semibold text-amber-600">Not Connected</span></p>
                                    )}
                                </div>
                            </div>
                            {githubConnected ? (
                                <Button
                                    variant="outline"
                                    className="border-[#E5E7EB] bg-white text-[#111111] hover:bg-red-50 hover:text-red-500 hover:border-red-200 font-medium text-xs h-8 rounded-md px-4"
                                    onClick={() => handleDisconnect("github")}
                                    disabled={disconnectMutation.isPending}
                                >
                                    {disconnectMutation.isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
                                    Disconnect
                                </Button>
                            ) : (
                                <Button
                                    className="bg-[#111111] text-white hover:bg-[#333333] font-medium text-xs h-8 rounded-md px-4"
                                    onClick={() => handleConnect("github")}
                                    disabled={!isLoaded || connectingGithub}
                                >
                                    {connectingGithub ? (
                                        <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Connecting...</>
                                    ) : (
                                        <><LinkIcon className="w-3 h-3 mr-2" /> Connect</>
                                    )}
                                </Button>
                            )}
                        </div>

                        {/* X (Twitter) — Real OAuth via Clerk + DB persistence */}
                        <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-md bg-[#FAFAFA]">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex flex-col items-center justify-center border ${xConnected ? 'bg-[#F3F4F6] border-[#111111]' : 'bg-[#F3F4F6] border-[#E5E7EB]'}`}>
                                    <Twitter className={`w-5 h-5 ${xConnected ? 'text-[#111111]' : 'text-[#6B7280]'}`} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#111111] font-mono text-sm leading-tight">X_AUTH</h4>
                                    {connectionsLoading ? (
                                        <p className="text-xs text-[#9CA3AF] mt-1 tracking-wide">Loading...</p>
                                    ) : xConnected ? (
                                        <p className="text-xs text-[#6B7280] mt-1 tracking-wide">Connected: <span className="font-semibold text-[#111111]">@{xUsername || "Authorized User"}</span></p>
                                    ) : (
                                        <p className="text-xs text-[#6B7280] mt-1 tracking-wide">Status: <span className="font-semibold text-amber-600">Not Connected</span></p>
                                    )}
                                </div>
                            </div>
                            {xConnected ? (
                                <Button
                                    variant="outline"
                                    className="border-[#E5E7EB] bg-white text-[#111111] hover:bg-red-50 hover:text-red-500 hover:border-red-200 font-medium text-xs h-8 rounded-md px-4"
                                    onClick={() => handleDisconnect("x")}
                                    disabled={disconnectMutation.isPending}
                                >
                                    {disconnectMutation.isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
                                    Disconnect
                                </Button>
                            ) : (
                                <Button
                                    className="bg-[#111111] text-white hover:bg-[#333333] font-medium text-xs h-8 rounded-md px-4"
                                    onClick={() => handleConnect("x")}
                                    disabled={!isLoaded || connectingX}
                                >
                                    {connectingX ? (
                                        <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Connecting...</>
                                    ) : (
                                        <><LinkIcon className="w-3 h-3 mr-2" /> Connect</>
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-[#E5E7EB] shadow-none bg-white rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-[#E5E7EB] bg-[#FAFAFA] pb-4">
                        <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider text-[#6B7280] font-semibold">
                            <Activity className="w-4 h-4" /> Operating Parameters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="flex items-center justify-between p-5 border border-[#E5E7EB] rounded-md bg-[#FAFAFA]">
                            <div className="space-y-1">
                                <Label className="text-sm font-semibold tracking-wide text-[#111111]">Broadcast Notifications</Label>
                                <p className="text-xs text-[#6B7280]">Output success/failure logs to primary email address.</p>
                            </div>
                            <Switch
                                checked={primaryProject?.autoApprove ?? false}
                                onCheckedChange={(checked: boolean) => handleToggle("autoApprove", checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between p-5 border border-[#E5E7EB] rounded-md bg-[#FAFAFA]">
                            <div className="space-y-1">
                                <Label className="text-sm font-semibold tracking-wide text-[#111111]">Quiet Hours Restriction</Label>
                                <p className="text-xs text-[#6B7280]">Halt queue processing between 10PM and 8AM local compute time.</p>
                            </div>
                            <Switch
                                checked={false}
                                onCheckedChange={(checked: boolean) => {
                                    if (checked) toast.error("Quiet hours are not yet implemented.");
                                }}
                            />
                        </div>

                        {/* Save button removed because updates are optimistic and instant */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
