const SuccessRedIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_12276_29409)">
      <rect x="6" y="6" width="48" height="48" rx="24" fill="#DD3345" />
      <path
        d="M26.7931 33.8769L22.6231 29.7069L21.2031 31.1169L26.7931 36.7069L38.7931 24.7069L37.3831 23.2969L26.7931 33.8769Z"
        fill="white"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_12276_29409"
        x="0"
        y="0"
        width="60"
        height="60"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="6"
          operator="dilate"
          in="SourceAlpha"
          result="effect1_dropShadow_12276_29409"
        />
        <feOffset />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.996078 0 0 0 0 0.901961 0 0 0 0 0.898039 0 0 0 1 0"
        />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_12276_29409" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_12276_29409"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export default SuccessRedIcon;
