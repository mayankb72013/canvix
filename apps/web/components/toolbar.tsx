'use client';

import Box from "@repo/ui/box";
import Pencil from "@repo/ui/pencil";
import { useSetRecoilState } from "recoil";
import { clearCanvas, cursorState, toolSelected } from "../recoil/atoms";
import Ellipse from "@repo/ui/circle";
import Line from "@repo/ui/line";
import Text from "@repo/ui/text";
import SelectionTool from "@repo/ui/selection_arrow";
import Undo from "@repo/ui/undo";
import Redo from "@repo/ui/redo";
import DeleteBox from "@repo/ui/delete";
import { useUndoHandler } from "../app/utils/undo";
import { useRedoHandler } from "../app/utils/redo";

export default function Toolbar() {

    const setCurrentTool = useSetRecoilState(toolSelected);
    const setClearCanvas = useSetRecoilState(clearCanvas);

    const handleRedo = useRedoHandler();
    const handleUndo = useUndoHandler();

    const setCurrentCursor = useSetRecoilState(cursorState);
    return (
        <>
            <div className="h-full flex items-center border border-gray-100 text-neutral-700 rounded-lg shadow-sm px-2 py-3 flex justify-center items-center gap-6">
                
                <button className="size-5 cursor-pointer" onClick={() => {setCurrentTool("select"); setCurrentCursor("cursor-default");}}><SelectionTool /></button>
                <button className="size-5 cursor-pointer" onClick={() => {handleUndo()}}><Undo /></button>
                <button className="size-5 cursor-pointer" onClick={() => {handleRedo()}}><Redo /></button>

                {/* <div className="w-px py-3 bg-gray-200 self-stretch"></div> */}

                <button className="size-5 cursor-pointer" onClick={() => {setCurrentTool("pencil"); setCurrentCursor("cursor-crosshair")}}><Pencil /></button>
                <button className="size-5 cursor-pointer" onClick={() => {setCurrentTool("box"); setCurrentCursor("cursor-crosshair")}}><Box /></button>
                <button className="size-5 cursor-pointer" onClick={() => {setCurrentTool("ellipse"); setCurrentCursor("cursor-crosshair")}}><Ellipse /></button>
                <button className="size-5 cursor-pointer" onClick={() => {setCurrentTool("line"); setCurrentCursor("cursor-crosshair")}}><Line /></button>
                <button className="size-5 cursor-pointer" onClick={() => {setCurrentTool("text"); setCurrentCursor("cursor-crosshair")}}><Text /></button>

                <div className="w-px py-3 bg-gray-200 self-stretch"></div>

                <button className="size-5 text-red-500 cursor-pointer" onClick={() => {setClearCanvas(true); setCurrentCursor("cursor-default")}}><DeleteBox /></button>

            </div>

        </>
    )
}