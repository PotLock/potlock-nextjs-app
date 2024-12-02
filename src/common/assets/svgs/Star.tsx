const Star = (props: any) => (
  <svg
    {...props}
    width="16"
    height="15"
    viewBox="0 0 16 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Star 9" filter="url(#filter0_ii_22042_17248)">
      <path
        d="M7.4056 0.829151C7.59271 0.253362 8.40729 0.25336 8.5944 0.829149L9.88048 4.78677C9.96415 5.04427 10.2041 5.21861 10.4749 5.21862L14.6362 5.21877C15.2416 5.2188 15.4934 5.99352 15.0036 6.3494L11.6371 8.7955C11.418 8.95465 11.3264 9.23674 11.41 9.49424L12.6958 13.452C12.8829 14.0278 12.2239 14.5066 11.734 14.1507L8.36735 11.7049C8.1483 11.5457 7.8517 11.5457 7.63265 11.7049L4.26596 14.1507C3.77615 14.5066 3.11713 14.0278 3.3042 13.452L4.58997 9.49424C4.67363 9.23674 4.58198 8.95465 4.36294 8.7955L0.996436 6.3494C0.506648 5.99352 0.758368 5.2188 1.3638 5.21877L5.52514 5.21862C5.79589 5.21861 6.03585 5.04427 6.11952 4.78677L7.4056 0.829151Z"
        fill="#ECC113"
      />
    </g>
    <defs>
      <filter
        id="filter0_ii_22042_17248"
        x="0.737671"
        y="-1.10278"
        width="14.5247"
        height="16.1257"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-1.5" />
        <feGaussianBlur stdDeviation="1.125" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.501961 0 0 0 0 0.321569 0 0 0 0 0.0745098 0 0 0 0.24 0"
        />
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_22042_17248" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="0.75" />
        <feGaussianBlur stdDeviation="0.375" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
        <feBlend
          mode="normal"
          in2="effect1_innerShadow_22042_17248"
          result="effect2_innerShadow_22042_17248"
        />
      </filter>
    </defs>
  </svg>
);

export default Star;
