import { useRouter } from "next/router";
import React, { useState } from "react";
import { useUsernameStore } from "../stores/useUsernameStore";

export const Login: React.FC = () => {

    const [username, setUsername] = useUsernameStore((state: any) => [state.username, state.setUsername]);
    const [error, setError] = useState(false);

    const router = useRouter();

    const onChange = e => {
        setError(false);
        setUsername(e.target.value);
    }

    const onDone = () => {
        if (!username) return setError(true);
        router.push('/');
    };

    return (
        <div className="flex flex-col p-6 justify-center items-center w-400 rounded-8 bg-primary-800">
            <div className="text-primary-100 font-bold text-3xl w-full">Welcome!</div>
            <div className="text-primary-100 font-normal text-2xl w-full">Fill a name in the box below to begin chatting</div>
            <input 
                className={`w-full text-2xl mt-6 py-2 px-4 rounded-8 text-primary-100 placeholder-primary-300 focus:outline-none bg-primary-700 ${error ? 'border border-secondary' : ''}`}
                placeholder="Name"
                value={username}
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