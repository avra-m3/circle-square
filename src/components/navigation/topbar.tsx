import { FC, useEffect, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from '@firebase/auth';
import { auth } from '@/components/firebase/app';

interface TopbarProps {
}

export const Topbar: FC<TopbarProps> = () => {
    const [user, setUser] = useState<User | null>(null);
    const [showDropdown, hideDropdown] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                // ...
            } else {
                setUser(null);
            }
        });

    }, []);

    const onSignIn = async () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        await signInWithPopup(auth, provider)
    }

    return <nav
        className="z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-start rtl:justify-end">
                    <button
                            aria-controls="logo-sidebar" type="button"
                            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                        <span className="sr-only">Open sidebar</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" fillRule="evenodd"
                                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                        </svg>
                    </button>
                    <a href="#" className="flex ms-2 md:me-24">
                        <span
                            className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Circle/Square</span>
                    </a>
                </div>
                {user ? <LoggedInUserControls user={user}/> : <AnonymousLoginControls onSignIn={onSignIn}/>}
            </div>
        </div>
    </nav>
}

const LoggedInUserControls = ({ user }: { user: User }) => {
    return <div className="flex items-center justify-end rtl:justify-end">
        <span className={"hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:hover:bg-gray-700 dark:focus:ring-blue-800"}>
        👋 {user.displayName}
        </span>
        <button className={"hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 mr-4"} onClick={() => signOut(auth)}>
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
            </svg>
        </button>
    </div>
}

const AnonymousLoginControls: FC<{ onSignIn: () => void }> = ({ onSignIn }) => {
    return <div className="flex items-center justify-end rtl:justify-end">
        <button
            type="button"
            onClick={onSignIn}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Sign in with Google
        </button>
    </div>
}