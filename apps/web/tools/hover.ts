import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { shapesArray, shapeSelected, strokeWidth } from "../recoil/atoms";
import { Shape } from "@repo/types";
import BoundingBox from "./boundingBox";
import { toLocalMouse } from "./Mouse";

export default function useHover() {
    const shapes = useRecoilValue(shapesArray);
    const lineWidth = useRecoilValue(strokeWidth);
    const selectedShape = useRecoilValue(shapeSelected);

    function handleHover(ctx: React.RefObject<CanvasRenderingContext2D | null>, clientX: number, clientY: number) {

        ctx.current?.save();
        ctx.current!.lineWidth = Math.max(10, lineWidth + 10);
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

            const { x, y } = toLocalMouse(clientX, clientY, shape);

            if (selectedShape) {
                const minX = Math.min(selectedShape.startX!, selectedShape.endX!);
                const maxX = Math.max(selectedShape.startX!, selectedShape.endX!);
                const minY = Math.min(selectedShape.startY!, selectedShape.endY!);
                const maxY = Math.max(selectedShape.startY!, selectedShape.endY!);
                
                if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
                  return true;
                }
            }

            let check = false;
            if (type === "pencil") {
                check = ctx.current?.isPointInStroke(path as Path2D, x, y) || false;
            } else if (type === "text") {

            } else {
                const thisPath = new Path2D();

                if (type === "box") {
                    const widthX = endX! - startX!;
                    const widthY = endY! - startY!;
                    thisPath.rect(startX as number, startY as number, widthX, widthY);

                    check = ctx.current?.isPointInStroke(thisPath as Path2D, x, y) || false;
                } else if (type === "ellipse") {
                    const radiusX = Math.abs(startX! - endX!) / 2;
                    const radiusY = Math.abs(startY! - endY!) / 2;
                    const startAngle = 0;
                    const endAngle = 2 * Math.PI;
                    const centerX = (Math.abs(startX! + endX!) / 2) as number;
                    const centerY = (Math.abs(startY! + endY!) / 2) as number;
                    thisPath.ellipse(centerX, centerY, radiusX, radiusY, 0, startAngle, endAngle);

                    check = ctx.current?.isPointInStroke(thisPath as Path2D, x, y) || false;
                } else if (type === "line") {
                    thisPath.moveTo(startX as number, startY as number);
                    thisPath.lineTo(endX as number, endY as number);

                    check = ctx.current?.isPointInStroke(thisPath as Path2D, x, y) || false;
                }
            }
            if (check) {
                return shape;
            }
        })
        
        ctx.current?.restore();
        const currentShape = hits.pop();
        if (currentShape) {
            return true;
        } else {
            return false;
        }

    }

    return handleHover;
}

