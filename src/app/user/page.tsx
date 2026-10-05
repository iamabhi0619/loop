"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { BookUser, Loader2, Mars, PenLine, UserCheck2, Venus } from "lucide-react";
import { motion } from "framer-motion";
import moment from "moment";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface User {
    id: string;
    userId: string;
    name: string;
    email: string;
    gender: string;
    bio: string;
    avatar: string;
    role: string;
    isVerified: boolean;
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
    isNewsletters: boolean;
    settings: {
        theme: string;
        language: string;
        notifications: boolean;
    }
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [imageUploading, setImageUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getUserProfile = async () => {
        try {
            const client = createClient();
            const { data: { session } } = await client.auth.getSession();
            if (!session?.user) {
                setError("Not authenticated");
                return;
            }
            const { data: userData } = await client
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();
            if (userData) {
                setUser(userData as any);
            }
        } catch (error) {
            toast.error("Failed to fetch user profile");
            console.error("Error fetching user profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    const handleImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;
        try {
            setImageUploading(true);
            const imageUrl = await uploadToCloudinary(file);
            const client = createClient();
            await client.from('users').update({ avatar: imageUrl }).eq('id', user.id);
            setUser({ ...user, avatar: imageUrl });
            toast.success("Profile picture updated!");
        } catch (error) {
            toast.error("Failed to upload image");
            console.error("Image upload error:", error);
        } finally {
            setImageUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-muted-foreground">{error || "User not found"}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    <div className="relative">
                        <div className="h-48 w-full rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20" />
                        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                            <div className="relative group">
                                <div className="h-32 w-32 rounded-full border-4 border-background overflow-hidden bg-muted">
                                    {user.avatar ? (
                                        <Image
                                            src={user.avatar}
                                            alt={user.name}
                                            width={128}
                                            height={128}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-3xl font-semibold bg-primary/10 text-primary">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="avatar-upload"
                                    className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    {imageUploading ? (
                                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                                    ) : (
                                        <PenLine className="h-6 w-6 text-white" />
                                    )}
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                    disabled={imageUploading}
                                />
                            </div>
                            <div className="pb-4">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {user.name}
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    @{user.userId || user.id.slice(0, 8)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-20 space-y-6">
                        <div className="flex flex-wrap gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                                <UserCheck2 className="h-4 w-4" />
                                {user.isVerified ? "Verified" : "Unverified"}
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                                {user.gender === "male" ? (
                                    <Mars className="h-4 w-4" />
                                ) : (
                                    <Venus className="h-4 w-4" />
                                )}
                                {user.gender?.charAt(0).toUpperCase() + user.gender?.slice(1)}
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                                <BookUser className="h-4 w-4" />
                                Joined {moment(user.createdAt).format("MMMM YYYY")}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
