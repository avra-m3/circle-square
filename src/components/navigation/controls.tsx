"use client"
import { FC, ReactNode } from 'react';

export interface Control {
    title?: string,
    icon?: FC,
    onClick?: () => void
    badge?: ReactNode
}

export interface LinkingControl extends Control {
    href: string
    onClick: undefined
}

interface ControlProps {
    show: boolean
    controls: (Control | LinkingControl)[]
}

const ControlW = 16;

export const Controls: FC<ControlProps> = ({ controls, show }) => <>
    <aside id="logo-sidebar"
           className={`h-[calc(100vh - 72px)] w-${ControlW} bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
           aria-label="Sidebar">
        <div className="h-full px-0.5 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
                {controls.map((control, index) => <li key={index}>
                    {control.onClick ? <button onClick={control.onClick}
                            className={"flex w-full text-left items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"}>
                        {control?.icon && control.icon({ className: "fill-gray-900 dark:fill-white" })}
                        <span className="flex-1 whitespace-nowrap">{control.title}</span>
                    </button> : <div>
                        {control?.icon && control.icon({ className: "fill-gray-900 dark:fill-white" })}
                        <span className="flex-1 whitespace-nowrap">{control.title}</span>
                    </div>}
                </li>)}
            </ul>
        </div>
    </aside>
</>


