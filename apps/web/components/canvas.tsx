'use client';

import { MouseEvent, useState } from "react";
import { useEffect, useRef } from "react";
import { pencilDraw } from "../drawingLogic/pencil";
import { useRecoilState, useRecoilValue } from "recoil";
import { clearCanvas, crosshairState, shapesArray, shapesChange, strokeColor, strokeWidth, toolSelected, } from "../recoil/atoms";
import { boxDraw } from "../drawingLogic/box";
import { ellipseDraw } from "../drawingLogic/ellipse";
import { lineDraw } from "../drawingLogic/line";
import { Shape } from "../app/types/types";
import { reDrawCanvas } from "../app/utils/redraw";
import { undo } from "../app/undo-redo/redo";
import { redo } from "../app/undo-redo/undo";

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

    const [shapes, setShapes] = useRecoilState(shapesArray);
    const [shapesChanged, setShapesChanged] = useRecoilState(shapesChange);

    const currentStrokeColor = useRecoilValue(strokeColor);
    const currentStrokeWidth = useRecoilValue(strokeWidth);

    const [textInput, setTextInput] = useState<{
        x: number;
        y: number;
        visible: boolean;
    }>({ x: 0, y: 0, visible: false });


    const [isClearCanvas, setClearCanvas] = useRecoilState(clearCanvas);

    const [isCrosshair, setIsCrosshair] = useRecoilState(crosshairState);
    useEffect(() => {
        mainCtx.current = mainCanvas.current!.getContext('2d');
        tempCtx.current = tempCanvas.current!.getContext('2d');

        const resizeCanvas = () => {
            mainCanvas.current!.width = window.innerWidth;
            mainCanvas.current!.height = window.innerHeight;
            tempCanvas.current!.width = window.innerWidth;
            tempCanvas.current!.height = window.innerHeight;

            reDrawCanvas(mainCtx, shapes);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // initial sizing

        return () => window.removeEventListener('resize', resizeCanvas);
    }, []); // run once

    // Handle clear canvas
    useEffect(() => {
        if (isClearCanvas) {
            mainCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
            setClearCanvas(false); 
        }
    }, [isClearCanvas]);

    // Handle undo/redo triggered redraw
    useEffect(() => {
        if (shapesChanged) {
            mainCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
            reDrawCanvas(mainCtx, shapes);
            setShapesChanged(false);
        }
    }, [shapesChanged]);

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

            setShapes(prev => {
                const newShapes: Shape[] = [...prev, {
                    type: "pencil",
                    path: currentPath.current as Path2D,
                    strokeColor: currentStrokeColor,
                    strokeWidth: currentStrokeWidth,
                }];
                undo.push(newShapes);
                return newShapes;
            });
            redo.length = 0;


            tempCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
            pencilDraw(mainCtx, startX.current, startY.current, currentPath.current as Path2D, false,currentStrokeColor,currentStrokeWidth);

        } else if (currentToolSelected === "box") {
            setShapes(s => {
                const newShapes: Shape[] = [...s,{
                    type: "box",
                    startX: startX.current,
                    startY: startY.current,
                    endX: e.clientX,
                    endY: e.clientY,
                    strokeColor: currentStrokeColor,
                    strokeWidth: currentStrokeWidth,
                }]
                undo.push(newShapes);
                return newShapes;
            })
            redo.length = 0;

            tempCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
            boxDraw(mainCtx, startX.current, startY.current, e.clientX, e.clientY, false,currentStrokeColor,currentStrokeWidth);
        } else if (currentToolSelected === "ellipse") {
            setShapes(s => {
                const newShapes: Shape[] = [...s,{
                    type: "ellipse",
                    startX: startX.current,
                    startY: startY.current,
                    endX: e.clientX,
                    endY: e.clientY,
                    strokeColor: currentStrokeColor,
                    strokeWidth: currentStrokeWidth,
                }]
                undo.push(newShapes);
                return newShapes;
            })
            redo.length = 0;

            tempCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
            ellipseDraw(mainCtx, startX.current, startY.current, e.clientX, e.clientY, false,currentStrokeColor,currentStrokeWidth);
        } else if (currentToolSelected === "line") {
            setShapes(s => {
                const newShapes: Shape[] = [...s,{
                    type: "line",
                    startX: startX.current,
                    startY: startY.current,
                    endX: e.clientX,
                    endY: e.clientY,
                    strokeColor: currentStrokeColor,
                    strokeWidth: currentStrokeWidth,
                }]
                undo.push(newShapes);
                return newShapes;
            })
            redo.length = 0;

            tempCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
            lineDraw(mainCtx, startX.current, startY.current, e.clientX, e.clientY, false,currentStrokeColor,currentStrokeWidth);
        } else if (currentToolSelected === "text") {

        }
        mainCtx.current!.beginPath();
    }

    function draw(e: MouseEvent) {
        if (!isPainting.current) return;
        if (currentToolSelected === "pencil") {
            pencilDraw(tempCtx, e.clientX, e.clientY, currentPath.current as Path2D, true,currentStrokeColor,currentStrokeWidth);
        } else if (currentToolSelected === "box") {
            boxDraw(tempCtx, startX.current, startY.current, e.clientX, e.clientY, true,currentStrokeColor,currentStrokeWidth);
        } else if (currentToolSelected === "ellipse") {
            ellipseDraw(tempCtx, startX.current, startY.current, e.clientX, e.clientY, true,currentStrokeColor,currentStrokeWidth);
        } else if (currentToolSelected === "line") {
            lineDraw(tempCtx, startX.current, startY.current, e.clientX, e.clientY, true,currentStrokeColor,currentStrokeWidth);
        }
    }

    return (
        <>
            <div className="relative w-screen h-screen">
                <canvas ref={mainCanvas} className={`absolute top-0 left-0 z-0 ${(isCrosshair?'cursor-crosshair':'')}`} />
                <canvas className={`absolute top-0 left-0 z-10 ${(isCrosshair?'cursor-crosshair':'')}`} onMouseDown={(e) => startPainting(e)} onMouseUp={(e) => stopPainting(e)} onMouseMove={(e) => draw(e)} ref={tempCanvas} />
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