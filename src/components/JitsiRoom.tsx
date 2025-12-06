import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface JitsiRoomProps {
  roomName: string;
  displayName: string;
  onLeave?: () => void;
  isInstructor?: boolean;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

const JitsiRoom = ({ roomName, displayName, onLeave, isInstructor = false }: JitsiRoomProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load Jitsi Meet API script
    const loadJitsiScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Jitsi script"));
        document.body.appendChild(script);
      });
    };

    const initJitsi = async () => {
      try {
        await loadJitsiScript();

        if (!containerRef.current) return;

        // FX Pulse branded room configuration
        const domain = "meet.jit.si";
        const options = {
          roomName: `FXPulse_${roomName.replace(/\s+/g, "_")}`,
          parentNode: containerRef.current,
          width: "100%",
          height: "100%",
          configOverwrite: {
            startWithAudioMuted: !isInstructor,
            startWithVideoMuted: !isInstructor,
            disableModeratorIndicator: false,
            enableEmailInStats: false,
            prejoinPageEnabled: true,
            disableDeepLinking: true,
            enableClosePage: true,
            enableWelcomePage: false,
            toolbarButtons: [
              "microphone",
              "camera",
              "closedcaptions",
              "desktop",
              "fullscreen",
              "fodeviceselection",
              "hangup",
              "profile",
              "chat",
              "recording",
              "livestreaming",
              "etherpad",
              "sharedvideo",
              "settings",
              "raisehand",
              "videoquality",
              "filmstrip",
              "feedback",
              "stats",
              "shortcuts",
              "tileview",
              "download",
              "help",
              "mute-everyone",
              "security",
            ],
            // Branding
            brandingRoomAlias: "FX Pulse Live Class",
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            BRAND_WATERMARK_LINK: "",
            SHOW_POWERED_BY: false,
            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            TOOLBAR_ALWAYS_VISIBLE: true,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
            MOBILE_APP_PROMO: false,
            HIDE_INVITE_MORE_HEADER: false,
            DEFAULT_BACKGROUND: "#0a0f1c",
            DEFAULT_LOCAL_DISPLAY_NAME: displayName,
            DEFAULT_REMOTE_DISPLAY_NAME: "Fellow Trader",
            PROVIDER_NAME: "FX Pulse",
            APP_NAME: "FX Pulse Live Classes",
            NATIVE_APP_NAME: "FX Pulse",
            LANG_DETECTION: true,
            SETTINGS_SECTIONS: ["devices", "language", "moderator", "profile"],
          },
          userInfo: {
            displayName: displayName,
          },
        };

        apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

        apiRef.current.addListener("videoConferenceJoined", () => {
          setLoading(false);
        });

        apiRef.current.addListener("readyToClose", () => {
          if (onLeave) onLeave();
        });

        // Give moderator rights to instructor
        if (isInstructor) {
          apiRef.current.addListener("participantRoleChanged", (event: any) => {
            if (event.role === "moderator") {
              apiRef.current.executeCommand("toggleLobby", true);
            }
          });
        }
      } catch (error) {
        console.error("Jitsi initialization error:", error);
        setLoading(false);
      }
    };

    initJitsi();

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [roomName, displayName, isInstructor, onLeave]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden bg-card border border-border">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-10">
          <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
          <p className="text-muted-foreground">Connecting to classroom...</p>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" style={{ minHeight: "600px" }} />
    </div>
  );
};

export default JitsiRoom;
