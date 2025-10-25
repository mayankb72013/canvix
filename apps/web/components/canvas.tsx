'use client';

import { MouseEvent, useState } from "react";
import { useEffect, useRef } from "react";
import { pencilDraw } from "../drawingLogic/pencil";
import { useRecoilState, useRecoilValue } from "recoil";
import { clearCanvas, redoStack, toolSelected, undoStack } from "../recoil/atoms";
import { boxDraw } from "../drawingLogic/box";
import { ellipseDraw } from "../drawingLogic/ellipse";
import { lineDraw } from "../drawingLogic/line";
import { Shape } from "../app/types/types";

export default function Canvas() {
    const mainCanvas = useRef<HTMLCanvasElement>(null);
    const tempCanvas = useRef<HTMLCanvasElement>(null);
    const mainCtx = useRef<CanvasRenderingContext2D | null>(null);
    const tempCtx = useRef<CanvasRenderingContext2D | null>(null);
    const isPainting = useRef<boolean>(false);
    const currentToolSelected = useRecoilValue(toolSelected);
    const startX = useRef<number>(0);
    const startY = useRef<number>(0);
    const currentPath = useRef<Path2D>();

    const [shapes,setShapes] = useState<Shape[]>([]);
    const [undo, setUndo] = useRecoilState(undoStack);
    const [redo, setRedo] = useRecoilState(redoStack);

    const [textInput, setTextInput] = useState<{
        x: number;
        y: number;
        visible: boolean;
    }>({ x: 0, y: 0, visible: false });


    const [isClearCanvas, setClearCanvas] = useRecoilState(clearCanvas);
    useEffect(() => {

        if (isClearCanvas) {
            mainCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
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

        if (currentToolSelected === "text") {
            setTextInput({ x: e.clientX, y: e.clientY, visible: true });
            isPainting.current = false; // stop further drawing
        } else if (currentToolSelected === "pencil") {
            currentPath.current = new Path2D();
            draw(e);
        } else {
            draw(e);
        }
    }

    function stopPainting(e: MouseEvent) {
        isPainting.current = false;

        if (currentToolSelected === "pencil") {
            setShapes(s => [...s,{
                type: "pencil",
                path: currentPath.current,
            }])

            // undoStack.push([...shapes]);
            // redoStack.length = 0;
            setUndo([...shapes]);
            setRedo([]);
            
            // mainCtx.current!.stroke(currentPath.current as Path2D);
            tempCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
            pencilDraw(mainCtx,startX.current,startY.current,currentPath.current as Path2D,false);
            // currentPath.current=null;
        } else if (currentToolSelected === "box") {
            tempCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
            boxDraw(mainCtx, startX.current, startY.current, e, false);
        } else if (currentToolSelected === "ellipse") {
            tempCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
            ellipseDraw(mainCtx, startX.current, startY.current, e, false);
        } else if (currentToolSelected === "line") {
            tempCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
            lineDraw(mainCtx, startX.current, startY.current, e, false);
        } else if (currentToolSelected === "text") {

        }
        mainCtx.current!.beginPath();
    }

    function draw(e: MouseEvent) {
        if (!isPainting.current) return;
        if (currentToolSelected === "pencil") {
            pencilDraw(tempCtx, e.clientX, e.clientY, currentPath.current as Path2D,true);
        } else if (currentToolSelected === "box") {
            boxDraw(tempCtx, startX.current, startY.current, e, true);
        } else if (currentToolSelected === "ellipse") {
            ellipseDraw(tempCtx, startX.current, startY.current, e, true);
        } else if (currentToolSelected === "line") {
            lineDraw(tempCtx, startX.current, startY.current, e, true);
        }
    }

    return (
        <>
            <div className="relative w-screen h-screen">
                <canvas ref={mainCanvas} className="absolute top-0 left-0 z-0" />
                <canvas className="absolute top-0 left-0 z-10" onMouseDown={(e) => startPainting(e)} onMouseUp={(e) => stopPainting(e)} onMouseMove={(e) => draw(e)} ref={tempCanvas} />
                {currentToolSelected === "text" && textInput.visible && (
                    <textarea
                        className="absolute border px-1 py-0.5 text-sm text-black z-20 bg-white"
                        style={{ left: `${textInput.x}px`, top: `${textInput.y}px` }}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                mainCtx.current!.textBaseline = "top";
                                mainCtx.current!.textAlign = "left";
                                mainCtx.current!.fillText(e.currentTarget.value, textInput.x, textInput.y);
                                setTextInput(prev => ({ ...prev, visible: false }));
                            }
                        }}
                    />
                )}
            </div>
        </>
    )
}