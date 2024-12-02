export const CheckedIcon = (props: any) => {
  return (
    <svg
      {...props}
      width="46"
      height="46"
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_ddd_22476_13290)">
        <path
          d="M3 22C3 10.9543 11.9543 2 23 2C34.0457 2 43 10.9543 43 22C43 33.0457 34.0457 42 23 42C11.9543 42 3 33.0457 3 22Z"
          fill="#F7F7F7"
        />
        <path
          d="M19.7951 25.8749L15.6251 21.7049L14.2051 23.1149L19.7951 28.7049L31.7951 16.7049L30.3851 15.2949L19.7951 25.8749Z"
          fill="#7B7B7B"
        />
      </g>
      <defs>
        <filter
          id="filter0_ddd_22476_13290"
          x="0.5"
          y="0.5"
          width="45"
          height="45"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="0.5"
            operator="erode"
            in="SourceAlpha"
            result="effect1_dropShadow_22476_13290"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0196078 0 0 0 0 0.0196078 0 0 0 0 0.0196078 0 0 0 0.08 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_22476_13290" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="0.5"
            operator="erode"
            in="SourceAlpha"
            result="effect2_dropShadow_22476_13290"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="0.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0196078 0 0 0 0 0.0196078 0 0 0 0 0.0196078 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_22476_13290"
            result="effect2_dropShadow_22476_13290"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="0.5"
            operator="dilate"
            in="SourceAlpha"
            result="effect3_dropShadow_22476_13290"
          />
          <feOffset />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
          <feBlend
            mode="normal"
            in2="effect2_dropShadow_22476_13290"
            result="effect3_dropShadow_22476_13290"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect3_dropShadow_22476_13290"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
