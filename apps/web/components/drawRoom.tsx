import { Dispatch, SetStateAction } from "react";

export default function DrawRoom({collab}:{collab: Dispatch<SetStateAction<boolean>>}) {



    return (
        <>
            <div onClick={()=>collab(true)} className="py-2 px-3 rounded-lg text-white cursor-pointer" style={{ backgroundColor: '#6965DB' }}>Collab</div>
        </>
    )
}