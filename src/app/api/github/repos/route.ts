import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || "1";
        const perPage = searchParams.get("per_page") || "100";

        // Fetch the user's GitHub OAuth token from Clerk
        const client = await clerkClient();
        const providerData = await client.users.getUserOauthAccessToken(userId, "oauth_github");
        const accessToken = providerData.data[0]?.token;

        if (!accessToken) {
            return new NextResponse("GitHub access token not found. Please link your GitHub account in Settings.", { status: 401 });
        }

        const response = await fetch(`https://api.github.com/user/repos?affiliation=owner,collaborator,organization_member&sort=updated&per_page=${perPage}&page=${page}`, {
            headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: `Bearer ${accessToken}`
            },
        });

        if (!response.ok) {
            console.error("GitHub API error", response.status, await response.text());
            return new NextResponse("Failed to fetch from GitHub", { status: response.status });
        }

        const data = await response.json();

        // Ensure data is sorted from newest to oldest
        data.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

        // Map to match the expected Repo type in the frontend
        const mappedRepos = data.map((repo: any) => ({
            id: repo.id.toString(),
            full_name: repo.full_name,
            updated_at: repo.updated_at,
            private: repo.private
        }));

        return NextResponse.json(mappedRepos);
    } catch (error) {
        console.error("[GITHUB_REPOS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
