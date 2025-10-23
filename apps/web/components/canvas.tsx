'use client';

import { MouseEvent } from "react";
import { useEffect, useRef } from "react";
import { pencilDraw } from "../drawingLogic/pencil";
import { useRecoilValue } from "recoil";
import { toolSelected } from "../recoil/atoms";

export default function Canvas() {
    const c = useRef<HTMLCanvasElement>(null);
    const ctx = useRef<CanvasRenderingContext2D | null>(null);
    const isPainting = useRef<boolean>(false);
    const currentToolSelected = useRecoilValue(toolSelected);

    useEffect(() => {
        ctx.current = c.current!.getContext('2d');

        c.current!.height = window.innerHeight;
        c.current!.width = window.innerWidth;
    }, [])

    function startPainting(e: MouseEvent) {
        isPainting.current = true;
        draw(e);
    }

    function stopPainting() {
        isPainting.current = false;
        ctx.current!.beginPath();
    }

    function draw(e: MouseEvent) {
        if(!isPainting.current) return;
        if (currentToolSelected === "pencil") {
            pencilDraw(ctx, e.clientX, e.clientY);
        }
    }

    return (
        <>
            <canvas onMouseDown={(e)=>startPainting(e)} onMouseUp={stopPainting} onMouseMove={(e)=>draw(e)} ref={c}></canvas>
        </>
    )
}