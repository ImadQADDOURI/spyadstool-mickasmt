// /app/page.tsx
"use client";

import { useState, useTransition } from "react";

import { captureRequests } from "@/app/actions/captureRequests";

export default function Home() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleCapture = async () => {
    startTransition(async () => {
      try {
        const data = await captureRequests();
        setRequests(data);
      } catch (error) {
        console.error("Error capturing requests:", error);
      }
    });
  };

  return (
    <div>
      <button onClick={handleCapture} disabled={isPending}>
        {isPending ? "Capturing..." : "Capture Requests"}
      </button>
      <pre>{JSON.stringify(requests, null, 2)}</pre>
    </div>
  );
}
