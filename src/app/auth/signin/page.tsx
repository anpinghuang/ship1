"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, GithubIcon } from "lucide-react";

export default function SignIn() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-zinc-50 px-4">
            <Card className="mx-auto w-full max-w-md bg-white border-zinc-100 rounded-[2rem] p-4 shadow-xl shadow-zinc-200">
                <CardHeader className="text-center space-y-4 pt-10">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--hero)] text-white font-bold text-3xl">
                        S
                    </div>
                    <CardTitle className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Welcome back</CardTitle>
                    <CardDescription className="text-[var(--muted-foreground)] text-lg font-medium">
                        Continue where you left off building in public.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-12 pt-6 flex flex-col items-center">
                    <Button
                        size="lg"
                        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-lg h-16 rounded-2xl shadow-lg border-none flex items-center justify-center gap-3 transition-transform active:scale-95"
                    >
                        <Github className="h-6 w-6" />
                        Sign in with GitHub
                    </Button>
                    <div className="mt-8 text-sm text-[var(--muted-foreground)] font-medium text-center">
                        By signing in, you agree to our Terms of Service <br /> and Privacy Policy.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
