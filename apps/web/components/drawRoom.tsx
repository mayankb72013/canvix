import CopyBox from "@repo/ui/copy";
import PlayBox from "@repo/ui/playBox";
import StopBox from "@repo/ui/stopBox";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { generateRoomId } from "../app/utils/roomId";
import { roomId, shapesArray, webSocketConnection } from "../recoil/atoms";
import { EventType, WSMessage } from "@repo/types";

export default function DrawRoom() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [roomCode, setRoomCode] = useRecoilState(roomId);
    const [isJoiningRoom, setIsJoiningRoom] = useState(false);
    const [webSocket, setWebSocket] = useRecoilState(webSocketConnection);
    const [shapes, setShapes] = useRecoilState(shapesArray);
    const [teammates, setTeammates] = useState<number>();
    const [error, setError] = useState("none");

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsModalOpen(false);
        };
        window.addEventListener("keydown", handler);

        const ws = new WebSocket("ws://localhost:8080");
        setWebSocket(ws);

        ws.onmessage = (message) => {
            const msg = JSON.parse(message.data);

            if (msg.messageType === "room-state") {
                setTeammates(msg.clients);
                setShapes(msg.shapes);
                setRoomCode(msg.roomId);
                setIsSessionActive(true);
            } else if (msg.messageType === "shapes") {

            } else if (msg.messageType === "error") {
                setError(msg.error);
                setTimeout(() => {
                    setError("none");
                }, 2000)
            } else if (msg.messageType === "shape-operation") {
                const shapeOperation: EventType = msg.payload;

                if (shapeOperation.type === "updated") {
                    if (shapeOperation.updatedShape) {
                        const updatedShape = shapeOperation.updatedShape;

                        const newPath = new Path2D();
                        if (updatedShape.type === "pencil" && updatedShape.pointsInPath) {
                            newPath.moveTo(updatedShape.pointsInPath[0]?.x!, updatedShape.pointsInPath[0]?.y!);
                            for (let i = 1; i < updatedShape.pointsInPath.length; i++) {
                                newPath.lineTo(updatedShape.pointsInPath[i]?.x!, updatedShape.pointsInPath[i]?.y!);
                            }
                            updatedShape.path = newPath;
                        }
                        
                        setShapes((shapes) => {
                            return shapes.map((s) => {
                                if (s.id === shapeOperation.shapeId) {
                                    return updatedShape;
                                } else {
                                    return s;
                                }
                            })
                        })
                    }
                } else if (shapeOperation.type === "insertion") {
                    if (shapeOperation.updatedShape) {
                        const updatedShape = shapeOperation.updatedShape;
                        const newPath = new Path2D();
                        if (updatedShape.type === "pencil" && updatedShape.pointsInPath) {
                            newPath.moveTo(updatedShape.pointsInPath[0]?.x!, updatedShape.pointsInPath[0]?.y!);
                            for (let i = 1; i < updatedShape.pointsInPath.length; i++) {
                                newPath.lineTo(updatedShape.pointsInPath[i]?.x!, updatedShape.pointsInPath[i]?.y!);
                            }
                            updatedShape.path = newPath;
                        }
                        setShapes((shapes) => [...shapes, updatedShape]);

                    }
                } else if (shapeOperation.type === "delete") {
                    setShapes((shapes) => {
                        return shapes.filter((s) => {
                            if (s.id === shapeOperation.shapeId) {
                                return false;
                            }
                            return true;
                        })
                    });
                }

            } else if (msg.messageType === "clients") {
                setTeammates(msg.clients);
            }
        }

        ws.onerror = console.error;

        return () => {
            window.removeEventListener("keydown", handler);
            ws.close();
        };
    }, []);

    function handleJoinRoom(roomId: string | undefined) {

        if (!roomId) return;

        const message: WSMessage = {
            messageType: "join-room",
            roomId: roomId,
        }
        webSocket.send(JSON.stringify(message));
    }

    function handleCreateRoom() {

        const newRoomCode = generateRoomId(8);

        setRoomCode(newRoomCode);
        setIsSessionActive(true);

        const message: WSMessage = {
            messageType: "create-room",
            roomId: newRoomCode,
        }
        webSocket.send(JSON.stringify(message));
    }

    function handleStopSession() {

        const message: WSMessage = {
            messageType: "leave-room",
            roomId: roomCode
        }

        webSocket.send(JSON.stringify(message));

        alert("Session Ended");
    }

    return (
        <>
            <button onClick={() => setIsModalOpen(true)} className="py-2 px-3 rounded-lg text-white cursor-pointer" style={{ backgroundColor: isSessionActive ? "#0fb884" : "#6965DB", }}>Collab</button>
            {(isSessionActive && (teammates !== undefined)) && <div className="absolute right-0 top-6 rounded-full px-1.5 py-0.5 text-xs" style={{ backgroundColor: "#b2f2bb" }}>{teammates}</div>}
            {isModalOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center">

                    <div className="absolute inset-0 bg-black/30" onClick={() => { setIsModalOpen(false); setIsJoiningRoom(false) }} />
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
                                    <button onClick={() => { handleCreateRoom() }} className="text-white px-4 py-3 rounded-lg flex items-center gap-2 cursor-pointer" style={{ backgroundColor: "#6965DB" }}>
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
                                {!isJoiningRoom && <div>
                                    <button onClick={() => setIsJoiningRoom(true)} className="px-4 py-3 rounded-lg flex items-center gap-2 cursor-pointer bg-gray-200">
                                        Join room
                                    </button>
                                </div>}
                                {isJoiningRoom && <div className="flex flex-col w-[80%] mt-5">
                                    <div>Enter Room-id:</div>
                                    <div className="flex gap-3">
                                        <input ref={inputRef} type="text" maxLength={8} className="border p-3 rounded-lg w-full tracking-widest bg-[#EBEAFA] border-[#A2A0E9]" />
                                        <button onClick={() => { handleJoinRoom(inputRef.current?.value); }} className="flex items-center gap-1 text-white px-5 rounded-lg cursor-pointer" style={{ backgroundColor: "#6965DB" }}>
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

                                <button onClick={() => { setIsSessionActive(false); setIsModalOpen(false); handleStopSession(); }} className="border border-red-500 text-red-700 rounded-md flex gap-2 p-3 justify-center mt-4 cursor-pointer">
                                    <span className="size-5">
                                        <StopBox />
                                    </span>
                                    Stop session
                                </button>
                            </div>
                        )}
                        {(error !== "none") && <div className="text-red-500">{error}</div>}
                    </div>
                </div>
            )}
        </>
    );
}
