"use client"
import { Control, Controls, LinkingControl } from "@/components/navigation/controls";
import { CanvasPrimary } from '@/components/canvas/CanvasPrimary';
import { Topbar } from '@/components/navigation/topbar';
import React, { useEffect, useState } from 'react';
import { CustomCanvas } from '@/components/canvas/CustomCanvas';
import {
    deleteShapeFromDb,
    listenForUpdates,
    updateShapeInDb,
    writeNewShapeToDb
} from '@/components/firebase/database';
import { CustomCircle } from '@/components/canvas/Shapes';
import { CircleIcon, SquareIcon } from '@/components/icons';

export default function Home() {
    const [canvas, setCanvas] = useState<CustomCanvas | null>(null)
    const [zoom, setZoom] = useState<number>(1)

    const setupCanvas = async (canvas: CustomCanvas) => {
        setCanvas(canvas)
        canvas.on('object:added', ({ target }) => writeNewShapeToDb(target as CustomCircle))
        canvas.on('object:modified', ({ target, }) => updateShapeInDb(target as CustomCircle))
        canvas.on('object:removed', ({ target }) => deleteShapeFromDb(target as CustomCircle))

        listenForUpdates((type, id, data) => {
            console.log(type, id)
            if (type === "delete") {
                canvas.remove(canvas._objectsById[id])
                return;
            }
            canvas.addOrUpdateFromDb({ [id]: data })
        })
    }

    useEffect(() => {
        const handleKeyboard = (event: KeyboardEvent) => canvas?.setupKeyboardEvents(event.key);
        window.addEventListener("keydown", handleKeyboard);
        return () => {
            window.removeEventListener("keydown", handleKeyboard.bind(canvas));
        }
    }, [canvas]);

    useEffect(() => {
        canvas?.on('mouse:wheel', () => {
            setZoom(canvas?.getZoom())
        })
    }, [canvas])


    const controls: (Control | LinkingControl)[] = [
        { icon: CircleIcon, onClick: () => canvas?.addCircle({}) },
        { icon: SquareIcon, onClick: () => canvas?.addRect({}) },
        { title: `${(zoom * 100).toFixed(0)}%` }
    ]


    return (
        <div className={"max-h-screen"}>
            <Topbar/>
            <main className="grid grid-cols-[48px_1fr] gap-0 bg-gray-200">
                <Controls controls={controls} show={false}/>
                <CanvasPrimary canvas={canvas} setCanvas={setupCanvas}/>
            </main>
        </div>

    );
}
