// components/shared/AudienceNetworkIcon.tsx

import React from "react";

const AudienceNetworkIcon = ({
  className,
  color,
}: {
  className?: string;
  color?: string;
}) => (
  <svg
    id="Layer_2"
    data-name="Layer 2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 386.21 399.67"
    className={className}
    style={{ fill: color }}
  >
    <defs>
      <style>
        {`.cls-1 { fill: ${color || "#58409b"}; stroke-width: 0px; }`}
      </style>
    </defs>
    <g id="Layer_1-2" data-name="Layer 1">
      <path
        className="cls-1"
        d="M11.22,336.14c-1.68,1.68-2.66,4.07-2.66,6.59v47.68c0,5.05,4.07,9.26,9.26,9.26h47.68
        c2.38,0,4.77-0.98,6.59-2.66l36.04-36.04h169.83v-0.28l36.04,36.04c1.68,1.68,4.07,2.66,6.59,2.66h47.68
        c5.05,0,9.26-4.07,9.26-9.26v-47.68c0-2.38-0.98-4.77-2.66-6.59l-33.52-33.52c28.05-31.97,44.88-73.2,44.88-118.08
        C386.21,82.46,299.68,0,193.1,0S0,82.46,0,184.27c0,44.88,16.83,86.1,44.88,118.08l-33.66,33.8ZM192.82,84.14
        c67.03,0,115.13,42.91,115.13,103.21,0,29.31-10.38,54.27-32.11,73.06-21.88,19.63-48.94,29.31-82.88,29.31
        s-61-9.82-82.88-29.31c-21.88-18.79-32.39-43.61-32.39-73.06,0-60.3,48.24-103.21,115.13-103.21Z"
      />
    </g>
  </svg>
);

export default AudienceNetworkIcon;
