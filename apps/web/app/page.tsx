'use client';

import { useEffect, useRef } from "react";
import Canvas from "../components/canvas";
import DrawRoom from "../components/drawRoom";
import Sidebar from "../components/sidebar";
import Toolbar from "../components/toolbar";
import { useRedoHandler } from "./utils/redo";
import { useUndoHandler } from "./utils/undo";
import { useRecoilValue } from "recoil";
import { imageData } from "../recoil/atoms";



export default function Page() {

  const handleUndo = useUndoHandler();
  const handleRedo = useRedoHandler();
  const exportRef = useRef<HTMLAnchorElement>(null);
  const image = useRecoilValue(imageData);

  useEffect(()=>{
    if (image && exportRef.current) {
      exportRef.current.href = image;
    }
  },[image]);

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
        <div className="absolute z-50 right-8 top-3 mt-4 flex gap-2 items-center">
          <a ref={exportRef} className="py-2 px-3 rounded-lg bg-gray-200" href="#" download>Export</a>
          <DrawRoom></DrawRoom>
        </div>
        <div className="absolute z-0">
          <Canvas></Canvas>
        </div>

      </div>
    </>
  );
}
