import { SVGProps } from "react";

const BurgerMenuSvg = (props: SVGProps<SVGSVGElement>) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <svg width={32} height={32} viewBox="0 0 25 25" {...props}>
    <g>
      <path d="M0 0h25v5H0zM0 10h25v5H0zM0 20h25v5H0z" />
    </g>
  </svg>
);

export default BurgerMenuSvg;
