import Canvas from "../components/canvas";
import Toolbar from "../components/toolbar";

export default function Page() {
  return (
    <>
      <div className="relative flex justify-center">
        <div className="absolute z-50 w-[30%] mt-4">
          <Toolbar></Toolbar>
        </div>
        <div className="absolute z-0">
          <Canvas></Canvas>
        </div>
      </div>
    </>
  );
}
