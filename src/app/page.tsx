"use client"
import { Control, Controls, LinkingControl } from "@/components/navigation/controls";
import { CanvasPrimary } from '@/components/canvas/CanvasPrimary';
import { Topbar } from '@/components/navigation/topbar';
import { useEffect, useState } from 'react';
import { CustomCanvas } from '@/components/canvas/CustomCanvas';
import {
    deleteShapeFromDb,
    getAllObjects,
    listenForUpdates,
    updateShapeInDb,
    writeNewShapeToDb
} from '@/components/firebase/database';
import { CustomCircle } from '@/components/canvas/Shapes';
import firebase from "firebase/compat/app";
import { auth } from "firebaseui";
import { app } from '@/components/firebase/app';
import { getAuth } from '@firebase/auth';


export default function Home() {
    const [canvas, setCanvas] = useState<CustomCanvas | null>(null)
    const [zoom, setZoom] = useState<number>(1)

    const setupCanvas = async (canvas: CustomCanvas) => {
        setCanvas(canvas)
        // canvas.addOrUpdateFromDb(await getAllObjects())
        canvas.on('object:added', ({ target }) => writeNewShapeToDb(target as CustomCircle))
        canvas.on('object:modified', ({ target, }) => updateShapeInDb(target as CustomCircle))
        canvas.on('object:removed', ({ target }) => deleteShapeFromDb(target as CustomCircle))

        listenForUpdates((type, id, data) => {
            console.log(type, id, data)
            if (type === "delete") {
                canvas.remove(canvas._objectsById[id])
                return;
            }
            canvas.addOrUpdateFromDb({ [id]: data })


        })
    }

    useEffect(() => {
        const handleKeyboard = (event: KeyboardEvent) => canvas?.setupKeyboardEvents(event.key, event);
        window.addEventListener("keydown", handleKeyboard);
        return () => {
            window.removeEventListener("keydown", handleKeyboard.bind(canvas));
        }
    }, [canvas]);

    useEffect(() => {
        canvas?.on('mouse:wheel', (event) => {
            setZoom(canvas?.getZoom())
        })
    }, [canvas])


    const controls: (Control | LinkingControl)[] = [
        { title: "Circle", onClick: () => canvas?.addCircle({}) },
        { title: "Square", onClick: () => canvas?.addRect({}) },
        { title: `zoom ${(zoom * 100).toFixed(0)}%` }
    ]


    return (
        <div className={"max-h-screen"}>
            <Topbar/>
            <main className="grid grid-cols-1 sm:grid-cols-[125px_1fr] gap-0 bg-cyan-50">
                <Controls controls={controls} show={false}/>
                <CanvasPrimary canvas={canvas} setCanvas={setupCanvas}/>
            </main>
        </div>

    );
}
