import { useRouter } from "next/router";
import React, { useState } from "react";
import { useConn } from "../hooks/useConn";
import { useUserStore, UserStoreType } from "../stores/useUserStore";

export const Login: React.FC = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState(false);

    const setUser = useUserStore((state: UserStoreType) => state.setUser);

    const router = useRouter();

    const onChange = e => {
        setError(false);
        setName(e.target.value);
    }

    const onDone = async () => {
        if (!name) return setError(true);
        setUser(name, '');

        router.push('/');
    };

    return (
        <div className="flex flex-col p-6 justify-center items-center w-400 rounded-8 sm:bg-primary-800">
            <div className="text-primary-100 font-bold text-3xl w-full">Welcome!</div>
            <div className="text-primary-100 font-normal text-2xl w-full">Fill your name in the box below to begin battleship royale</div>
            <input 
                className={`w-full text-2xl mt-6 py-2 px-4 rounded-8 text-primary-100 placeholder-primary-300 focus:outline-none bg-primary-700 ${error ? 'border border-secondary' : ''}`}
                placeholder="Name"
                value={name}
                onChange={e => onChange(e)}
                onKeyPress={e => e.key == 'Enter' && onDone()}
            />
            <button 
                className="w-full text-2xl mt-2 py-2 px-4 rounded-8 text-primary-100 md:hover:bg-accent-hover focus:outline-none bg-accent font-bold"
                onClick={_ => onDone()}
            >
                Done
            </button>
        </div>
    );
};