import dynamic from "next/dynamic";
import { AspectRatio, Center } from "@chakra-ui/react";
import { setup, draw, windowResized } from "@/lib/sketch2";

const importFunction = () => import("react-p5").then((mod) => mod.default);
let Sketch: any = null;
if (typeof window !== "undefined") {
  Sketch = dynamic(importFunction, { ssr: false });
}

// const selectedMetals: string[] = ["metal1", "metal2", "metal3"];

const P5jsContainer: React.FC = (selectedMetals) => {
  return (
    <>
      <Sketch setup={setup} draw={draw} windowResized={windowResized} />
    </>
  );
};

export default P5jsContainer;
