import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { shapesArray, shapeSelected, strokeWidth } from "../recoil/atoms";
import { Shape } from "../app/types/types";
import BoundingBox from "./boundingBox";

export default function useSelect() {
    const shapes = useRecoilValue(shapesArray);
    const setSelectedShape = useSetRecoilState(shapeSelected);
    const lineWidth = useRecoilValue(strokeWidth);

    function handleSelect(ctx: React.RefObject<CanvasRenderingContext2D | null>, tempCtx: React.RefObject<CanvasRenderingContext2D | null>, clientX: number, clientY: number) {

        tempCtx.current!.lineWidth = 2
        tempCtx.current!.strokeStyle = "#2684ff"
        ctx.current?.save();
        ctx.current!.lineWidth = Math.max(10, lineWidth + 8);
        const hits = shapes.filter((shape) => {

            const {
                id,
                type,
                startX,
                startY,
                endX,
                endY,
                rotation,
                path,        // For freehand pencil
                color,
                strokeWidth,
                strokeColor,
            } = shape;

            const centerX = (shape?.startX! + shape?.endX!) / 2;
            const centerY = (shape?.startY! + shape?.endY!) / 2;

            ctx.current?.translate(centerX, centerY);
            ctx.current?.rotate(shape.rotation as number);
            ctx.current?.translate(-centerX, -centerY);



            let check = false;
            if (type === "pencil") {
                check = ctx.current?.isPointInStroke(path as Path2D, clientX, clientY) || false;
            } else if (type === "text") {

            } else {
                const thisPath = new Path2D();
                if (type === "box") {
                    const widthX = endX! - startX!;
                    const widthY = endY! - startY!;
                    thisPath.rect(startX as number, startY as number, widthX, widthY);

                    check = ctx.current?.isPointInStroke(thisPath as Path2D, clientX, clientY) || false;
                } else if (type === "ellipse") {
                    const radiusX = Math.abs(startX! - endX!) / 2;
                    const radiusY = Math.abs(startY! - endY!) / 2;
                    const startAngle = 0;
                    const endAngle = 2 * Math.PI;
                    const x = (Math.abs(startX! + endX!) / 2) as number;
                    const y = (Math.abs(startY! + endY!) / 2) as number;
                    thisPath.ellipse(x, y, radiusX, radiusY, 0, startAngle, endAngle);

                    check = ctx.current?.isPointInStroke(thisPath as Path2D, clientX, clientY) || false;
                } else if (type === "line") {
                    thisPath.moveTo(startX as number, startY as number);
                    thisPath.lineTo(endX as number, endY as number);

                    check = ctx.current?.isPointInStroke(thisPath as Path2D, clientX, clientY) || false;
                }
            }

            ctx.current?.restore();
            if (check) {
                return shape;
            }
        })


        const currentShape = hits.pop();

        
        if (currentShape) {
            const centerX = (currentShape?.startX! + currentShape?.endX!) / 2;
            const centerY = (currentShape?.startY! + currentShape?.endY!) / 2;
            setSelectedShape(currentShape);
    
            tempCtx.current?.save();
            tempCtx.current?.translate(centerX, centerY);
            tempCtx.current?.rotate(currentShape.rotation as number);
            tempCtx.current?.translate(-centerX, -centerY);
            BoundingBox(tempCtx, currentShape);
            tempCtx.current?.restore();
        } else {
            setSelectedShape(undefined);
            BoundingBox(tempCtx);
        }

    }

    return handleSelect;
}