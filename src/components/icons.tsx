import { FC, SVGProps } from 'react';

export const SquareIcon: FC<SVGProps<any>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" {...props}
                    viewBox="0 0 448 512">
    <path
        d="M384 80c8.8 0 16 7.2 16 16l0 320c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16L48 96c0-8.8 7.2-16 16-16l320 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32z"/>
</svg>

export const CircleIcon: FC<SVGProps<any>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" {...props}
                    viewBox="0 0 512 512">
    <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/>
</svg>