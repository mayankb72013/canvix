'use client';

import { MouseEvent } from "react";
import { useEffect, useRef } from "react";

export default function Canvas() {
    const c = useRef<HTMLCanvasElement>(null);
    const ctx = useRef<CanvasRenderingContext2D | null>(null);
    const isPainting = useRef<boolean>(false);

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

        ctx.current!.lineWidth=10;
        ctx.current!.lineCap="round"

        ctx.current!.lineTo(e.clientX,e.clientY);
        ctx.current!.stroke();
        ctx.current!.beginPath();
        ctx.current!.moveTo(e.clientX,e.clientY);
    }

    return (
        <>
            <canvas onMouseDown={(e)=>startPainting(e)} onMouseUp={stopPainting} onMouseMove={(e)=>draw(e)} ref={c}></canvas>
        </>
    )
}