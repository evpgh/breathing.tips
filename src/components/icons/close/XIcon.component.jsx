import * as React from "react";

function XIcon(props) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 11l6-6m0 6L5 5"
      />
    </svg>
  );
}

export default XIcon;
