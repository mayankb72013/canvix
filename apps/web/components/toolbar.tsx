'use client';

import Box from "@repo/ui/box";
import Pencil from "@repo/ui/pencil";
import { useSetRecoilState } from "recoil";
import { clearCanvas, crosshairState, toolSelected } from "../recoil/atoms";
import Ellipse from "@repo/ui/ellipse";
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

    const setCrosshair = useSetRecoilState(crosshairState);
    return (
        <>
            <div className="h-full flex items-center border border-gray-100 text-neutral-700 rounded-lg shadow-sm px-2 py-3 flex justify-center items-center gap-6">
                
                <button className="size-5 cursor-pointer" onClick={() => {setCurrentTool("select"); setCrosshair(false)}}><SelectionTool /></button>
                <button className="size-5 cursor-pointer" onClick={() => {handleUndo()}}><Undo /></button>
                <button className="size-5 cursor-pointer" onClick={() => {handleRedo()}}><Redo /></button>

                {/* <div className="w-px py-3 bg-gray-200 self-stretch"></div> */}

                <button className="size-5 cursor-pointer" onClick={() => {setCurrentTool("pencil"); setCrosshair(true)}}><Pencil /></button>
                <button className="size-5 cursor-pointer" onClick={() => {setCurrentTool("box"); setCrosshair(true)}}><Box /></button>
                <button className="size-5 cursor-pointer" onClick={() => {setCurrentTool("ellipse"); setCrosshair(true)}}><Ellipse /></button>
                <button className="size-5 cursor-pointer" onClick={() => {setCurrentTool("line"); setCrosshair(true)}}><Line /></button>
                <button className="size-5 cursor-pointer" onClick={() => {setCurrentTool("text"); setCrosshair(true)}}><Text /></button>

                <div className="w-px py-3 bg-gray-200 self-stretch"></div>

                <button className="size-5 text-red-500 cursor-pointer" onClick={() => {setClearCanvas(true); setCrosshair(false)}}><DeleteBox /></button>

            </div>

        </>
    )
}