'use client';

import { useEffect, useState } from "react";
import Canvas from "../components/canvas";
import DrawRoom from "../components/drawRoom";
import Sidebar from "../components/sidebar";
import Toolbar from "../components/toolbar";
import { useRedoHandler } from "./utils/redo";
import { useUndoHandler } from "./utils/undo";
import CopyBox from "@repo/ui/copy";
import PlayBox from "@repo/ui/playBox";
import StopBox from "@repo/ui/stopBox";
import { useRecoilState } from "recoil";
import { roomId } from "../recoil/atoms";
import { generateRoomId } from "./utils/roomId";


export default function Page() {

  const handleUndo = useUndoHandler();
  const handleRedo = useRedoHandler();

  const [share, setShare] = useState<boolean>(false);
  const [showSession, setShowSession] = useState<boolean>(false);
  const [roomCode, setRoomCode] = useRecoilState(roomId);
  const [isSession, setIsSession] = useState(false);
  useEffect(() => {
    if (showSession) {
      const currentRoomId = generateRoomId(8);
      setRoomCode(currentRoomId);
    }
  }, [showSession])

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
          {!isSession && <div onClick={() => setShare(true)} className="py-2 px-3 rounded-lg text-white cursor-pointer" style={{ backgroundColor: '#6965DB' }}>Collab</div>}
          {isSession && <div onClick={()=>setShare(true)} className="py-2 px-3 rounded-lg text-white cursor-pointer" style={{ backgroundColor: '#0fb884' }}>Collab</div> }
        </div>
        <div className="absolute z-0">
          <Canvas></Canvas>
        </div>
        {(share || showSession) && <div className="flex items-center justify-center w-screen h-screen">
          <div onClick={() => { setShare(false); setShowSession(false) }} className="bg-neutral-800 absolute z-60 w-screen h-screen flex justify-center items-center opacity-20">
          </div>
          {(share && !isSession) && <div className="w-[25%] absolute z-70 bg-white rounded-lg p-10 flex flex-col items-center justify-center gap-5 shadow-xl/30">
            <div className="font-bold text-lg" style={{ color: '#6965DB' }}>Live Collaboration</div>
            <div className="w-full text-sm flex justify-center">Invite people to collaborate on your drawing.</div>
            <div onClick={() => { setShare(false); setShowSession(true); setIsSession(true) }} className="text-white p-3 rounded-lg cursor-pointer flex gap-2 items-center" style={{ backgroundColor: '#6965DB' }}>
              <div className="size-5"><PlayBox></PlayBox></div>
              <div>Start session</div>
            </div>
          </div>}
          {(showSession || isSession) && <div className="w-[25%] absolute z-70 bg-white rounded-lg p-10 flex flex-col items-center justify-center gap-5 shadow-xl/30">
            <div className="w-full text-sm flex flex-col gap-3">
              <span className="text-md">Room-id</span>
              <div className="flex gap-3 w-full">
                <div className="border p-4 rounded-lg w-full font-light tracking-widest" style={{ backgroundColor: "#EBEAFA", borderColor: "#A2A0E9" }}>{roomCode}</div>
                <div onClick={() => { navigator.clipboard.writeText(roomCode); }} className="flex cursor-pointer items-center text-white p-3 rounded-lg gap-1" style={{ backgroundColor: '#6965DB' }}>
                  <span className="size-4"><CopyBox></CopyBox></span>
                  <span>Copy</span>
                </div>
              </div>
              <div className="flex w-full justify-center mt-4">
                <div className="border border-red-500 rounded-md flex gap-2 p-4 text-red-700 opacity-65 cursor-pointer">
                  <div className="size-5"><StopBox></StopBox></div>
                  <div onClick={() => { setIsSession(false); setShowSession(false) }}>Stop session</div>
                </div>
              </div>
            </div>
          </div>}
        </div>
        }
      </div>
    </>
  );
}
