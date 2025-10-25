import Stroke from "@repo/ui/stroke";
import { useSetRecoilState } from "recoil";
import { strokeColor, strokeWidth } from "../recoil/atoms";

export default function Sidebar() {

    const setStrokeWidth = useSetRecoilState(strokeWidth);
    const setStrokeColor = useSetRecoilState(strokeColor);
    return (
        <>
            <div className="p-2 border border-gray-100 rounded-md flex flex-col gap-4 text-xs font-light shadow-md">
                <div className="flex flex-col gap-2">
                    <div>Stroke color</div>
                    <div className="flex gap-1.5">
                        <button onClick={()=>setStrokeColor('#000000')} className="bg-black p-3 w-3 rounded-md"></button>
                        <button onClick={()=>setStrokeColor('#e03131')} className="p-3 w-3 rounded-md" style={{backgroundColor: '#e03131'}}></button>
                        <button onClick={()=>setStrokeColor('#2f9e44')} className="p-3 w-3 rounded-md" style={{backgroundColor: '#2f9e44'}}></button>
                        <button onClick={()=>setStrokeColor('#1971c2')} className="p-3 w-3 rounded-md" style={{backgroundColor: '#1971c2'}}></button>
                        <button onClick={()=>setStrokeColor('#f08c00')} className="p-3 w-3 rounded-md" style={{backgroundColor: '#f08c00'}}></button>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div>Stroke width</div>
                    <div className="flex gap-3">
                        <button onClick={()=>setStrokeWidth(1)} className="w-7 rounded-md bg-gray-100 p-1"><Stroke size="sm"/></button>
                        <button onClick={()=>setStrokeWidth(5)} className="w-7 rounded-md bg-gray-100 p-1"><Stroke size="md"/></button>
                        <button onClick={()=>setStrokeWidth(9)} className="w-7 rounded-md bg-gray-100 p-1"><Stroke size="lg"/></button>
                    </div>
                </div>
            </div>
        </>
    )
}