'use client';

import Canvas from "../components/canvas";
import Sidebar from "../components/sidebar";
import Toolbar from "../components/toolbar";
import { useRedoHandler } from "./utils/redo";
import { useUndoHandler } from "./utils/undo";


export default function Page() {

  const handleUndo = useUndoHandler();
  const handleRedo = useRedoHandler();

  return (
    <>
      <div onKeyDown={(e)=>{
        if(e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z") handleRedo();
        else if(e.ctrlKey && e.key.toLowerCase() === "z") handleUndo();
      }} tabIndex={0} className="relative h-screen w-screen overflow-hidden outline-none">
        <div className="absolute top-2 left-[38%] z-50 w-[25%] mt-4 z-50 bg-white">
          <Toolbar></Toolbar>
        </div>
        <div className="absolute top-[30%] left-4 z-50 bg-white">
          <Sidebar></Sidebar>
        </div>
        <div className="absolute z-0">
          <Canvas></Canvas>
        </div>
      </div>
    </>
  );
}
