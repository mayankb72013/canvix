'use client';

import Box from "@repo/ui/box";
import Pencil from "@repo/ui/pencil";
import { useSetRecoilState } from "recoil";
import { toolSelected } from "../recoil/atoms";
import Ellipse from "@repo/ui/ellipse";
import Line from "@repo/ui/line";
import Text from "@repo/ui/text";
import SelectionTool from "@repo/ui/selection_arrow";
import Undo from "@repo/ui/undo";
import Redo from "@repo/ui/redo";
import DeleteBox from "@repo/ui/delete";

export default function Toolbar() {

    const setCurrentTool = useSetRecoilState(toolSelected);

    return (
        <>
            <div className="h-full flex items-center border border-gray-100 text-neutral-700 rounded-md shadow-sm px-2 py-3 flex justify-center items-center gap-5">
                
                <button className="size-5 cursor-pointer" onClick={() => setCurrentTool("select")}><SelectionTool /></button>
                <button className="size-5 cursor-pointer" onClick={() => setCurrentTool("undo")}><Undo /></button>
                <button className="size-5 cursor-pointer" onClick={() => setCurrentTool("redo")}><Redo /></button>

                {/* <div className="w-px py-3 bg-gray-200 self-stretch"></div> */}

                <button className="size-5 cursor-pointer" onClick={() => setCurrentTool("pencil")}><Pencil /></button>
                <button className="size-5 cursor-pointer" onClick={() => setCurrentTool("box")}><Box /></button>
                <button className="size-5 cursor-pointer" onClick={() => setCurrentTool("ellipse")}><Ellipse /></button>
                <button className="size-5 cursor-pointer" onClick={() => setCurrentTool("line")}><Line /></button>
                <button className="size-5 cursor-pointer" onClick={() => setCurrentTool("text")}><Text /></button>

                <div className="w-px py-3 bg-gray-200 self-stretch"></div>

                <button className="size-5 text-red-500 cursor-pointer" onClick={() => setCurrentTool("clearCanvas")}><DeleteBox /></button>

            </div>

        </>
    )
}