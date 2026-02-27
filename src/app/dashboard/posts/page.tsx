"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Filter,
    MoreHorizontal,
    Twitter,
    Github,
    Clock,
    CheckCircle2,
    AlertCircle,
    Copy,
    Trash2,
    Calendar,
    Sparkles
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function PostsPage() {
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [content, setContent] = useState("");

    const posts = [
        { id: "1", repo: "ship-in-public", content: "Just pushed a major refactor for the AI engine! 🚀 #buildinpublic", status: "Scheduled", time: "Today, 4:00 PM", variants: 3 },
        { id: "2", repo: "next-saas-template", content: "Stripe integration is finally live in the template. 💳 ✨", status: "Posted", time: "Yesterday, 10:00 AM", variants: 2 },
        { id: "3", repo: "ship-in-public", content: "Working on the new dashboard layout. Decisions, decisions...", status: "Draft", time: "Created 2h ago", variants: 4 },
        { id: "4", repo: "cool-web-app", content: "Beta testers are loving the new speed improvements!", status: "Failed", time: "Oct 24, 2024", variants: 1 },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Scheduled": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 font-bold"><Clock className="mr-1 h-3 w-3" /> Scheduled</Badge>;
            case "Posted": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 font-bold"><CheckCircle2 className="mr-1 h-3 w-3" /> Posted</Badge>;
            case "Failed": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-3 font-bold"><AlertCircle className="mr-1 h-3 w-3" /> Failed</Badge>;
            default: return <Badge className="bg-zinc-100 text-zinc-700 hover:bg-zinc-100 border-none px-3 font-bold">Draft</Badge>;
        }
    };

    const handleRowClick = (post: any) => {
        setSelectedPost(post);
        setContent(post.content);
        setIsSheetOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-extrabold text-[var(--foreground)] tracking-tight">Posts Queue</h1>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl border-zinc-200 font-bold"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                    <Button className="bg-[var(--hero)] text-white font-bold rounded-xl border-none h-11 px-6">Archive All</Button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-zinc-50 overflow-hidden">
                <div className="p-4 border-b border-zinc-50 flex items-center justify-between">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input placeholder="Search posts..." className="pl-10 h-11 rounded-xl bg-zinc-50 border-none font-medium" />
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-zinc-50">
                            <TableHead className="w-[300px] font-bold text-zinc-400 uppercase text-[10px] tracking-widest pl-6">Post Content</TableHead>
                            <TableHead className="font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Repository</TableHead>
                            <TableHead className="font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Status</TableHead>
                            <TableHead className="font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Date / Time</TableHead>
                            <TableHead className="text-right pr-6 font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow
                                key={post.id}
                                onClick={() => handleRowClick(post)}
                                className="group cursor-pointer border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                            >
                                <TableCell className="font-medium p-6 pl-6 max-w-[400px]">
                                    <div className="truncate text-zinc-900 font-bold">{post.content}</div>
                                </TableCell>
                                <TableCell className="p-6">
                                    <div className="flex items-center gap-2 font-bold text-zinc-500">
                                        <Github size={14} /> {post.repo}
                                    </div>
                                </TableCell>
                                <TableCell className="p-6">{getStatusBadge(post.status)}</TableCell>
                                <TableCell className="p-6 font-bold text-zinc-500">{post.time}</TableCell>
                                <TableCell className="text-right p-6 pr-6">
                                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-zinc-100">
                                        <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-[400px] sm:w-[540px] bg-white border-none p-0 overflow-y-auto">
                    {selectedPost && (
                        <div className="flex flex-col h-full">
                            <div className="p-8 border-b bg-zinc-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <Twitter className="text-[#1DA1F2]" />
                                    </div>
                                    <span className="font-black text-xl text-[var(--foreground)] lowercase">x.com/draft</span>
                                </div>
                                <Badge className="bg-zinc-200 text-zinc-700 hover:bg-zinc-200 border-none">ID: {selectedPost.id}</Badge>
                            </div>

                            <div className="flex-1 p-8 space-y-10">
                                <section className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-black uppercase text-zinc-400 tracking-widest pl-1">Post Content</label>
                                        <span className={`text-[10px] font-black uppercase rounded-md px-2 py-0.5 ${content.length > 280 ? "bg-red-100 text-red-500" : "bg-[var(--primary)]/10 text-[var(--primary)]"}`}>
                                            {content.length} / 280 CHARS
                                        </span>
                                    </div>
                                    <Textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="min-h-[200px] rounded-3xl border-2 border-zinc-100 p-6 text-lg font-medium focus:border-[var(--hero)]/30 transition-all resize-none leading-relaxed"
                                        placeholder="What's happening?"
                                    />
                                </section>

                                <section className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-black uppercase text-zinc-400 tracking-widest pl-1 flex items-center gap-2">
                                            <Sparkles size={14} className="text-[var(--primary)]" /> AI Variants
                                        </label>
                                        <Button variant="ghost" size="sm" className="text-[var(--hero)] font-bold text-xs h-8">Regenerate</Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[1, 2, 3, 4].map((v) => (
                                            <div
                                                key={v}
                                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${v === 1 ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-zinc-50 bg-zinc-50/50 hover:bg-zinc-50"}`}
                                            >
                                                <div className="text-[10px] font-black text-zinc-400 mb-2">VARIANT #{v}</div>
                                                <p className="text-xs font-medium line-clamp-2 text-zinc-600">This is an alternative draft generated by the AI engine...</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <label className="text-xs font-black uppercase text-zinc-400 tracking-widest pl-1">Schedule</label>
                                    <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                        <Calendar size={18} className="text-zinc-500" />
                                        <span className="font-bold text-[var(--foreground)]">{selectedPost.time}</span>
                                        <Button variant="link" className="ml-auto text-[var(--hero)] font-bold text-xs p-0">Change</Button>
                                    </div>
                                </section>
                            </div>

                            <div className="p-8 bg-zinc-50 border-t flex gap-4">
                                <Button className="flex-1 bg-[var(--hero)] text-white font-bold h-16 rounded-2xl border-none shadow-xl shadow-[var(--hero)]/20">
                                    Schedule Update
                                </Button>
                                <Button variant="outline" className="h-16 w-16 rounded-2xl border-zinc-200">
                                    <Copy className="h-5 w-5 text-zinc-400" />
                                </Button>
                                <Button variant="outline" className="h-16 w-16 rounded-2xl border-zinc-200 hover:bg-red-50 hover:border-red-100 group">
                                    <Trash2 className="h-5 w-5 text-zinc-400 group-hover:text-red-400" />
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
