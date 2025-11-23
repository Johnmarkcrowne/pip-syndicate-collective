import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VideoProgress {
  video_id: string;
  watched: boolean;
  watched_at: string | null;
}

export const useVideoProgress = (userId: string | undefined) => {
  const [progress, setProgress] = useState<VideoProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchProgress();
  }, [userId]);

  const fetchProgress = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("video_progress")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      setProgress(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading progress",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVideoProgress = async (videoId: string) => {
    if (!userId) return;

    const existingProgress = progress.find((p) => p.video_id === videoId);
    const newWatchedState = !existingProgress?.watched;

    try {
      if (existingProgress) {
        // Update existing progress
        const { error } = await supabase
          .from("video_progress")
          .update({
            watched: newWatchedState,
            watched_at: newWatchedState ? new Date().toISOString() : null,
          })
          .eq("user_id", userId)
          .eq("video_id", videoId);

        if (error) throw error;
      } else {
        // Insert new progress
        const { error } = await supabase.from("video_progress").insert({
          user_id: userId,
          video_id: videoId,
          watched: true,
          watched_at: new Date().toISOString(),
        });

        if (error) throw error;
      }

      // Refresh progress
      await fetchProgress();

      toast({
        title: newWatchedState ? "Video marked as watched" : "Video marked as unwatched",
        description: "Your progress has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating progress",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isVideoWatched = (videoId: string) => {
    return progress.find((p) => p.video_id === videoId)?.watched || false;
  };

  const getWatchedCount = () => {
    return progress.filter((p) => p.watched).length;
  };

  return {
    progress,
    loading,
    toggleVideoProgress,
    isVideoWatched,
    getWatchedCount,
  };
};