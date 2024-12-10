import { SVGProps } from "react";

export function SwapVerticalSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="m14 19l4-4l-1.4-1.4l-1.6 1.55V11h-2v4.15l-1.6-1.55L10 15zm-5-6h2V8.85l1.6 1.55L14 9l-4-4l-4 4l1.4 1.4L9 8.85zm3 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
      ></path>
    </svg>
  );
}