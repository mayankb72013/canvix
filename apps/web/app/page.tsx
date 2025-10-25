'use client';

import Canvas from "../components/canvas";
import Toolbar from "../components/toolbar";
import { useRedoHandler } from "./utils/redo";
import { useUndoHandler } from "./utils/undo";


export default function Page() {

  const handleUndo = useUndoHandler();
  const handleRedo = useRedoHandler();

  return (
    <>
      <div onKeyDown={(e)=>{
        if(e.ctrlKey && e.key === "z") handleUndo();
        else if(e.ctrlKey && e.key === "y") handleRedo();
      }} tabIndex={0} className="relative flex justify-center">
        <div className="absolute z-50 w-[25%] mt-4">
          <Toolbar></Toolbar>
        </div>
        <div className="absolute z-0">
          <Canvas></Canvas>
        </div>
      </div>
    </>
  );
}
