export function ArrowIcon({ rotate }: { rotate?: number } ) {
    return (
      <svg
        width="1.5rem"
        height="1.5rem"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#000"
        transform={`rotate(${rotate ? rotate : ''})`}
      >
        <path
          d="M7 10l5 5 5-5"
          strokeWidth={0.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }