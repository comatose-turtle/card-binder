import 'react'
import './CardTitle.css'
import { useLayoutEffect, useRef, type RefObject } from 'react';

interface CardTitleProps {
  name: string,
}

export function CardTitle({ name }: CardTitleProps) {
  const sizeTier : number = Math.floor(name.length / 5);
  const pathRef : RefObject<SVGPathElement|null> = useRef(null);
  const textRef : RefObject<SVGTextPathElement|null> = useRef(null);
  const uniqueId = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '')
              .trim().replace(/\s+/g, '-').replace(/-+/g, '-');
  
  useLayoutEffect(() => {
    if(pathRef.current !== null && textRef.current !== null) {
      const textLength = textRef.current.getComputedTextLength();
      const pathLength = pathRef.current.getTotalLength();
      if (textLength > pathLength) {
        textRef.current.setAttribute("textLength", "200");
        textRef.current.setAttribute("lengthAdjust", "spacingAndGlyphs");
        const sizeClass = parseInt(textRef.current.getAttribute("data-contentlength") || "1");
        textRef.current.setAttribute("data-contentlength", sizeClass+1+"");
      }
    }
  }, [pathRef, textRef])

  return (
    <div className='card-title'>
      <svg viewBox="0 0 250 50" style={{position: 'relative', top:`${-0.5 * (sizeTier-1) - 1}px`}}>
        <path ref={pathRef} id={uniqueId} fill="transparent" d="M25,30 C100,18 150,18 225,30" />
        <defs>
          <radialGradient id="MyGradient" cx="50%" cy="125%" r="90%">
            <stop offset="70%"  stopColor="rgb(43, 115, 21)"/>
            <stop offset="95%" stopColor="rgb(30, 162, 39)"/>
          </radialGradient>
          <filter id="bevel" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" result="noblack" values="
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              0.2126 0.7152 0.0722 0 -0.12
            "/>
            <feComponentTransfer in="noblack" result="noblack">
              <feFuncA type="gamma" amplitude="5" exponent="1" offset="0"/>
            </feComponentTransfer>
            <feMorphology in="noblack" operator="erode" radius="0.1" result="spindly" />
            <feGaussianBlur in="spindly" stdDeviation=".5" result="offsetBlur" />
            <feSpecularLighting in="offsetBlur" surfaceScale="15" specularConstant="0.7" specularExponent="2" lightingColor="#e2e2e2ff" result="specOut">
                <fePointLight x="-100" y="-100" z="-100" />
            </feSpecularLighting>
            <feComposite in="specOut" in2="offsetBlur" operator="in" result="specOut" />
            <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="specOut" />
            </feMerge>
        </filter>
        </defs>
        <text width="250" fill='url(#MyGradient)' stroke='#222' strokeWidth='1.5px' strokeLinecap='butt' strokeLinejoin='round' paintOrder='stroke' filter="url(#bevel)">
          <textPath ref={textRef} xlinkHref={'#' + uniqueId} startOffset='50%' textAnchor='middle' data-contentlength={sizeTier}>
            {name}
          </textPath>
        </text>
      </svg>
    </div>
  )
}