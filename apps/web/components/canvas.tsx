'use client';

import { MouseEvent } from "react";
import { useEffect, useRef } from "react";
import { pencilDraw } from "../drawingLogic/pencil";
import { useRecoilState, useRecoilValue } from "recoil";
import { clearCanvas, toolSelected } from "../recoil/atoms";
import { boxDraw } from "../drawingLogic/box";
import { ellipseDraw } from "../drawingLogic/ellipse";
import { lineDraw } from "../drawingLogic/line";

export default function Canvas() {
    const mainCanvas = useRef<HTMLCanvasElement>(null);
    const tempCanvas = useRef<HTMLCanvasElement>(null);
    const mainCtx = useRef<CanvasRenderingContext2D | null>(null);
    const tempCtx = useRef<CanvasRenderingContext2D | null>(null);
    const isPainting = useRef<boolean>(false);
    const currentToolSelected = useRecoilValue(toolSelected);
    const startX = useRef<number>(0);
    const startY = useRef<number>(0);

    const [isClearCanvas,setClearCanvas] = useRecoilState(clearCanvas);
    useEffect(() => {

        if (isClearCanvas) {
            mainCtx.current!.clearRect(0,0,window.innerWidth,window.innerHeight);
            setClearCanvas(false);
        }

        mainCtx.current = mainCanvas.current!.getContext('2d');
        tempCtx.current = tempCanvas.current!.getContext('2d');

        mainCanvas.current!.height = window.innerHeight;
        mainCanvas.current!.width = window.innerWidth;
        tempCanvas.current!.height = window.innerHeight;
        tempCanvas.current!.width = window.innerWidth;
    }, [isClearCanvas])

    function startPainting(e: MouseEvent) {
        isPainting.current = true;

        startX.current = e.clientX;
        startY.current = e.clientY;

        draw(e);
    }

    function stopPainting(e: MouseEvent) {
        isPainting.current = false;

        if (currentToolSelected === "pencil") {
            /* Nothing needed here as of yet */
        } else if (currentToolSelected === "box") {
            tempCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
            boxDraw(mainCtx, startX.current, startY.current, e,false);
        } else if (currentToolSelected === "ellipse") {
            tempCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
            ellipseDraw(mainCtx,startX.current,startY.current,e,false);
        } else if (currentToolSelected === "line") {
            tempCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
            lineDraw(mainCtx,startX.current,startY.current,e,false);
        }
        mainCtx.current!.beginPath();
    }

    function draw(e: MouseEvent) {
        if (!isPainting.current) return;
        if (currentToolSelected === "pencil") {
            pencilDraw(mainCtx, e.clientX, e.clientY);
        } else if (currentToolSelected === "box") {
            boxDraw(tempCtx, startX.current, startY.current, e,true);
        } else if (currentToolSelected === "ellipse") {
            ellipseDraw(tempCtx,startX.current,startY.current,e,true);
        } else if (currentToolSelected === "line") {
            lineDraw(tempCtx,startX.current,startY.current,e,true);
        }
    }

    return (
        <>
            <div className="relative w-screen h-screen">
                <canvas ref={mainCanvas} className="absolute top-0 left-0 z-0" />
                <canvas className="absolute top-0 left-0 z-10" onMouseDown={(e) => startPainting(e)} onMouseUp={(e) => stopPainting(e)} onMouseMove={(e) => draw(e)} ref={tempCanvas} />
            </div>
        </>
    )
}