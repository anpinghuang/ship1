import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* ─── Fetcher ─── */
async function apiFetch<T>(url: string, opts?: RequestInit): Promise<T> {
    const res = await fetch(url, opts);
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed: ${res.status}`);
    }
    return res.json();
}

/* ═══════════════ Query Keys ═══════════════ */

export const queryKeys = {
    dashboardStats: ["dashboard", "stats"] as const,
    connections: ["connections"] as const,
    posts: (projectId?: string) => ["posts", projectId ?? "all"] as const,
    projects: ["projects"] as const,
    commits: (projectId?: string) => ["commits", projectId ?? "all"] as const,
    githubRepos: ["github", "repos"] as const,
};

/* ═══════════════ Connections ═══════════════ */

export interface ConnectionStatus {
    github: { connected: boolean; username: string | null; connectedAt: string | null };
    twitter: { connected: boolean; username: string | null; connectedAt: string | null };
    lastPublished: string | null;
}

export function useConnections() {
    return useQuery({
        queryKey: queryKeys.connections,
        queryFn: () => apiFetch<ConnectionStatus>("/api/connections"),
        staleTime: 5 * 60_000, // 5 min — reads from DB, instant
        refetchOnWindowFocus: true,
    });
}

export function useSyncConnection() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (provider: string) =>
            apiFetch<any>("/api/connections/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ provider }),
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.connections });
        },
    });
}

export function useDisconnectProvider() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (provider: string) =>
            apiFetch<any>("/api/connections/disconnect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ provider }),
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.connections });
        },
    });
}

/* ═══════════════ Dashboard Stats ═══════════════ */

export function useDashboardStats() {
    return useQuery({
        queryKey: queryKeys.dashboardStats,
        queryFn: () => apiFetch<any>("/api/dashboard/stats"),
        staleTime: 60_000, // 1 min — home dashboard refreshes moderately
    });
}

/* ═══════════════ Posts ═══════════════ */

export function usePosts(projectId?: string) {
    const params = new URLSearchParams();
    if (projectId && projectId !== "all") params.set("projectId", projectId);
    return useQuery({
        queryKey: queryKeys.posts(projectId),
        queryFn: () => apiFetch<any[]>(`/api/posts?${params}`),
        staleTime: 30_000, // 30s — posts change frequently during editing
    });
}

/* ═══════════════ Projects (Automation) ═══════════════ */

export function useProjects() {
    return useQuery({
        queryKey: queryKeys.projects,
        queryFn: () => apiFetch<any[]>("/api/projects"),
        staleTime: 5 * 60_000, // 5 min — automation config rarely changes
    });
}

/* ═══════════════ Commits ═══════════════ */

export function useCommits(projectId?: string, enabled = false) {
    return useQuery({
        queryKey: queryKeys.commits(projectId),
        queryFn: async () => {
            const body: any = {};
            if (projectId && projectId !== "all") body.projectId = projectId;
            const data = await apiFetch<any>("/api/dashboard/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            return data.commits || [];
        },
        enabled,
        staleTime: 3 * 60_000, // 3 min — commits don't change that fast
    });
}

export function useBackfillCommits() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (projectId: string) =>
            apiFetch<any>("/api/dashboard/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId, backfill: true }),
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["commits"] });
        },
    });
}

/* ═══════════════ GitHub Repos (for add-repo picker) ═══════════════ */

export function useGithubRepos(enabled = false) {
    return useQuery({
        queryKey: queryKeys.githubRepos,
        queryFn: () => apiFetch<any[]>("/api/github/repos"),
        enabled,
        staleTime: 10 * 60_000, // 10 min — repos list almost never changes
    });
}

/* ═══════════════ Mutations ═══════════════ */

export function useUpdatePost() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: { postId: string; content?: string; action?: string }) =>
            apiFetch<any>("/api/posts", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["posts"] });
        },
    });
}

export function useDeletePost() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (postId: string) =>
            apiFetch<any>(`/api/posts?postId=${postId}`, { method: "DELETE" }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["posts"] });
            qc.invalidateQueries({ queryKey: queryKeys.dashboardStats });
        },
    });
}

export function usePostAction() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: { postId: string; action: string }) =>
            apiFetch<any>("/api/posts/action", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["posts"] });
            qc.invalidateQueries({ queryKey: queryKeys.dashboardStats });
        },
    });
}

export function useGeneratePost() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (commitSha: string) =>
            apiFetch<any>("/api/posts/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ commitSha }),
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["posts"] });
            qc.invalidateQueries({ queryKey: ["commits"] });
            qc.invalidateQueries({ queryKey: queryKeys.dashboardStats });
        },
    });
}

export function useAddProject() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: { githubRepoId: string; githubRepoName: string }) =>
            apiFetch<any>("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.projects });
            qc.invalidateQueries({ queryKey: queryKeys.dashboardStats });
            qc.invalidateQueries({ queryKey: ["commits"] });
        },
    });
}

export function useDeleteProject() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (projectId: string) =>
            apiFetch<any>(`/api/projects?projectId=${projectId}`, { method: "DELETE" }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.projects });
            qc.invalidateQueries({ queryKey: queryKeys.dashboardStats });
            qc.invalidateQueries({ queryKey: ["commits"] });
        },
    });
}

export function useUpdateProject() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: { projectId: string;[key: string]: any }) =>
            apiFetch<any>("/api/projects", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.projects });
        },
    });
}

export function useUpdateProjectSettings() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }: { id: string; autoDrafts?: boolean }) =>
            apiFetch<any>(`/api/projects/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }),
        onMutate: async ({ id, ...newData }) => {
            await qc.cancelQueries({ queryKey: queryKeys.projects });
            const previousProjects = qc.getQueryData<any[]>(queryKeys.projects);

            // Optimistically update the cache
            qc.setQueryData<any[]>(queryKeys.projects, (old) => {
                if (!old) return [];
                return old.map(p => p.id === id ? { ...p, ...newData } : p);
            });

            return { previousProjects };
        },
        onError: (err, newTodo, context) => {
            // Rollback on failure
            if (context?.previousProjects) {
                qc.setQueryData(queryKeys.projects, context.previousProjects);
            }
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: queryKeys.projects });
        },
    });
}
