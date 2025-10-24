'use client';

import Box from "@repo/ui/box";
import Pencil from "@repo/ui/pencil";
import { useSetRecoilState } from "recoil";
import { toolSelected } from "../recoil/atoms";
import Ellipse from "@repo/ui/ellipse";

export default function Toolbar() {

    const setCurrentTool = useSetRecoilState(toolSelected);

    return (
        <>
            <div className="border border-black-100 rounded-md shadow-sm px-2 py-3 flex items-center gap-3">
                <button className="size-5 cursor-pointer" onClick={()=>setCurrentTool("pencil")}><Pencil/></button>
                <button className="size-5 cursor-pointer" onClick={()=>setCurrentTool("box")}><Box/></button>
                <button className="size-5 cursor-pointer" onClick={()=>setCurrentTool("ellipse")}><Ellipse/></button>
            </div>
        </>
    )
}