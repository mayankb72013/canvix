'use client';

import { useState } from "react";
import Canvas from "../components/canvas";
import DrawRoom from "../components/drawRoom";
import Sidebar from "../components/sidebar";
import Toolbar from "../components/toolbar";
import { useRedoHandler } from "./utils/redo";
import { useUndoHandler } from "./utils/undo";
import CopyBox from "@repo/ui/copy";


export default function Page() {

  const handleUndo = useUndoHandler();
  const handleRedo = useRedoHandler();

  const [share, setShare] = useState<boolean>(false);

  return (
    <>
      <div onKeyDown={(e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z") handleRedo();
        else if (e.ctrlKey && e.key.toLowerCase() === "z") handleUndo();
      }} tabIndex={0} className="relative h-screen w-screen overflow-hidden outline-none">
        <div className="absolute top-2 left-[38%] z-50 w-[25%] mt-4 z-50 bg-white">
          <Toolbar></Toolbar>
        </div>
        <div className="absolute top-[30%] left-4 z-50 bg-white">
          <Sidebar></Sidebar>
        </div>
        <div className="absolute z-50 right-8 top-3 mt-4">
          <DrawRoom collab={setShare}></DrawRoom>
        </div>
        <div className="absolute z-0">
          <Canvas></Canvas>
        </div>
        {share && <div className="flex items-center justify-center w-screen h-screen">
          <div onClick={()=>setShare(false)} className="bg-neutral-800 absolute z-60 w-screen h-screen flex justify-center items-center opacity-20">
          </div>
            <div className="w-[25%] absolute z-70 bg-white rounded-lg p-10 flex flex-col items-center justify-center gap-5 shadow-xl/30">
              <div className="font-bold text-lg" style={{ color: '#6965DB' }}>Live Collaboration</div>
              <div className="w-full text-sm">Invite people to collaborate on your drawing.</div>
              <div className="w-full text-sm flex flex-col gap-3">
                <span>Room-id</span>
                <div className="flex gap-3 w-full">
                  <div className="border p-3 rounded-lg w-full font-light tracking-widest" style={{ backgroundColor: "#EBEAFA", borderColor: "#A2A0E9" }}>Des33s$21</div>
                  <div className="flex cursor-pointer items-center text-white p-3 rounded-lg gap-1" style={{ backgroundColor: '#6965DB' }}>
                    <span className="size-4"><CopyBox></CopyBox></span>
                    <span>Copy</span>
                  </div>
                </div>
              </div>
            </div>
        </div>
        }
      </div>
    </>
  );
}
