import React from "react";
import SliderContainer, { SliderItem } from "./slider";
import Image from "next/image";

const ClientLogos: React.FC = () => (
  <>
    <SliderContainer className="" contentWidth={1290} initialOffsetX={0}>
      <SliderItem width={150}>
        <Image
          src="/toolsweused/nextjs-dark.png"
          width={150}
          height={50}
          alt="Nextjs"
          objectFit="contain"
        />
      </SliderItem>
      <SliderItem width={150}>
        <Image
          src="/toolsweused/typescript.png"
          width={150}
          height={50}
          alt="TypeScript"
          objectFit="contain"
        />
      </SliderItem>
      <SliderItem width={125}>
        <Image
          src="/toolsweused/react.png"
          width={125}
          height={40}
          alt="React"
          objectFit="contain"
        />
      </SliderItem>
      <SliderItem width={80}>
        <Image
          src="/toolsweused/p5js.png"
          width={80}
          height={40}
          alt="p5js"
          objectFit="contain"
        />
      </SliderItem>
      <SliderItem width={170}>
        <Image
          src="/toolsweused/spotify.png"
          width={150}
          height={50}
          alt="Spotify"
          objectFit="contain"
        />
      </SliderItem>
      <SliderItem width={150}>
        <Image
          src="/toolsweused/neovim.png"
          width={150}
          height={50}
          alt="Neovim"
          objectFit="contain"
        />
      </SliderItem>
    </SliderContainer>
  </>
);

export default ClientLogos;
