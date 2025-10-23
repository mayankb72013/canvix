'use client';

import { useEffect, useRef } from "react";

export default function Canvas() {
    const c = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const ctx = c.current?.getContext('2d');

        
    }, [])

    return (
        <>
            <canvas ref={c}></canvas>
        </>
    )
}