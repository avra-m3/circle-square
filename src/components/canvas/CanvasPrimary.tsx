"use client"
import React, { FC, useEffect, useLayoutEffect, useRef } from 'react';
import { CustomCanvas } from '@/components/canvas/CustomCanvas';

interface SimpleProps {
    canvas: CustomCanvas | null,
    setCanvas: (canvas: CustomCanvas) => void
}

// @ts-ignore
export const CanvasPrimary: FC<SimpleProps> = ({ setCanvas, canvas: fabricCanvas }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (canvasRef.current && !canvasRef.current.hasAttribute('data-fabric')) {
            const fabricCanvas = new CustomCanvas(canvasRef.current)
            const resize= () => {
                if(!containerRef.current) return;
                fabricCanvas.setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                })
            }

            window.addEventListener('resize', () => resize())
            resize();

            setCanvas(fabricCanvas)
        }
    }, [canvasRef.current, containerRef.current])

    return <div ref={containerRef} className="h-[calc(100vh-64px)] sm:w-full relative">
        <div className={"absolute"}>
            <canvas ref={canvasRef} className={"absolute"}>
            </canvas>
        </div>
    </div>
}