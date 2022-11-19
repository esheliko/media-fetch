import React from "react";

type PlayProps = {
  title?: string;
} & React.SVGProps<SVGSVGElement>;

const PlayIcon: React.FC<PlayProps> = ({ title, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-4 0 17.8 16"
    style={{ fill: "currentColor" }}
    {...props}
  >
    <title>{title}</title>
    <path d="M0 0L13.8 8L0 16L0 0z" />
  </svg>
);

export default PlayIcon;
