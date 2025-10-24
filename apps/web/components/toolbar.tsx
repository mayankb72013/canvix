'use client';

import Box from "@repo/ui/box";
import Pencil from "@repo/ui/pencil";
import { useSetRecoilState } from "recoil";
import { toolSelected } from "../recoil/atoms";
import Ellipse from "@repo/ui/ellipse";
import Line from "@repo/ui/line";
import Text from "@repo/ui/text";

export default function Toolbar() {

    const setCurrentTool = useSetRecoilState(toolSelected);

    return (
        <>
            <div className="border border-gray-100 text-neutral-700 rounded-md shadow-sm px-2 py-3 flex items-center gap-4">
                <button className="size-5 cursor-pointer" onClick={()=>setCurrentTool("pencil")}><Pencil/></button>
                <button className="size-5 cursor-pointer" onClick={()=>setCurrentTool("box")}><Box/></button>
                <button className="size-5 cursor-pointer" onClick={()=>setCurrentTool("ellipse")}><Ellipse/></button>
                <button className="size-5 cursor-pointer" onClick={()=>setCurrentTool("line")}><Line/></button>
                <button className="size-5 cursor-pointer" onClick={()=>setCurrentTool("text")}><Text/></button>
            </div>
        </>
    )
}