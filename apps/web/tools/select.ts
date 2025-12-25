import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { shapesArray, shapeSelected } from "../recoil/atoms";
import { Shape } from "../app/types/types";
import BoundingBox from "./boundingBox";

export default function useSelect() {
    const shapes = useRecoilValue(shapesArray);
    const setSelectedShape = useSetRecoilState(shapeSelected);


    function handleSelect(ctx: React.RefObject<CanvasRenderingContext2D | null>, tempCtx: React.RefObject<CanvasRenderingContext2D | null>, clientX: number, clientY: number) {

        tempCtx.current!.lineWidth = 2
        tempCtx.current!.strokeStyle = "#2684ff"

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
                    thisPath.ellipse(x, y, radiusX, radiusY, rotation as number, startAngle, endAngle);
                    
                    check = ctx.current?.isPointInStroke(thisPath as Path2D, clientX, clientY) || false;
                } else if (type === "line") {
                    thisPath.moveTo(startX as number, startY as number);
                    thisPath.lineTo(endX as number, endY as number);
                    
                    check = ctx.current?.isPointInStroke(thisPath as Path2D, clientX, clientY) || false;
                }
            }
            
            if (check) {
                return shape;
            }
        })
        
        const currentShape = hits.pop();
        if (currentShape) {
            BoundingBox(tempCtx,currentShape,true);
            setSelectedShape(currentShape);
            BoundingBox(tempCtx,currentShape,false);
        } else {
            BoundingBox(tempCtx,currentShape,true);
        }
    }

    return handleSelect;
}