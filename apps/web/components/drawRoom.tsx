import CopyBox from "@repo/ui/copy";
import PlayBox from "@repo/ui/playBox";
import StopBox from "@repo/ui/stopBox";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { generateRoomId } from "../app/utils/roomId";
import { roomId } from "../recoil/atoms";

export default function DrawRoom() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [roomCode, setRoomCode] = useRecoilState(roomId);
    const [isJoiningRoom, setIsJoiningRoom] = useState(false);

    useEffect(() => {
        if (isSessionActive) {
            setRoomCode(generateRoomId(8));
        }
    }, [isSessionActive, setRoomCode]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsModalOpen(false);
        };
        window.addEventListener("keydown", handler);
        return () => {
            window.removeEventListener("keydown", handler);
        };
    }, []);

    function handleJoinRoom() {

    }

    return (
        <>
            <button onClick={() => setIsModalOpen(true)} className="py-2 px-3 rounded-lg text-white cursor-pointer" style={{ backgroundColor: isSessionActive ? "#0fb884" : "#6965DB", }}>Collab</button>

            {isModalOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center">

                    <div className="absolute inset-0 bg-black/30" onClick={() => setIsModalOpen(false)} />
                    <div className="relative z-50 w-[90%] max-w-md bg-white rounded-lg p-8 shadow-xl flex flex-col gap-5 items-center">

                        {!isSessionActive ? (
                            <>
                                <div className="font-bold text-xl text-[#6965DB]">
                                    Live Collaboration
                                </div>

                                <div className="text-sm text-center">
                                    Invite people to collaborate on your drawing.
                                </div>

                                <div className="flex gap-3 w-full justify-center">
                                    <button onClick={() => setIsSessionActive(true)} className="text-white px-4 py-3 rounded-lg flex items-center gap-2 cursor-pointer" style={{ backgroundColor: "#6965DB" }}>
                                        <span className="size-5">
                                            <PlayBox />
                                        </span>
                                        Start session
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-gray-100 h-0.5 w-40"></div>
                                    <div>Or</div>
                                    <div className="bg-gray-100 h-0.5 w-40"></div>
                                </div>
                                <div className="text-sm text-center">
                                    Join a live drawing session.
                                </div>
                                <div>
                                    <button onClick={() => setIsJoiningRoom(true)} className="px-4 py-3 rounded-lg flex items-center gap-2 cursor-pointer bg-gray-200">
                                        Join room
                                    </button>
                                </div>
                                {isJoiningRoom && <div className="flex flex-col w-[80%] mt-5">
                                    <div>Enter Room-id:</div>
                                    <div className="flex gap-3">
                                        <input type="text" maxLength={8} className="border p-3 rounded-lg w-full tracking-widest bg-[#EBEAFA] border-[#A2A0E9]" />
                                        <button onClick={() => handleJoinRoom} className="flex items-center gap-1 text-white px-5 rounded-lg cursor-pointer" style={{ backgroundColor: "#6965DB" }}>
                                            Join
                                        </button>
                                    </div>
                                </div>}
                            </>
                        ) : (
                            <div className="w-full flex flex-col gap-3">
                                <span className="text-md font-medium">Room ID</span>

                                <div className="flex gap-3">
                                    <div className="border p-3 rounded-lg w-full tracking-widest bg-[#EBEAFA] border-[#A2A0E9]">
                                        {roomCode}
                                    </div>

                                    <button onClick={() => navigator.clipboard.writeText(roomCode)} className="flex items-center gap-1 text-white px-3 rounded-lg cursor-pointer" style={{ backgroundColor: "#6965DB" }}>
                                        <span className="size-4">
                                            <CopyBox />
                                        </span>
                                        Copy
                                    </button>
                                </div>

                                <button onClick={() => { setIsSessionActive(false); setIsModalOpen(false); alert("Session Ended") }} className="border border-red-500 text-red-700 rounded-md flex gap-2 p-3 justify-center mt-4 cursor-pointer">
                                    <span className="size-5">
                                        <StopBox />
                                    </span>
                                    Stop session
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
