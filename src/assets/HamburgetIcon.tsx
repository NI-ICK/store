export function HamburgerIcon({ params }: { params?: React.SVGProps<SVGSVGElement> }) {
    return (
      <svg
        width="1.7rem"
        height="1.7rem"
        viewBox="0 -1 20 20"
        xmlns="http://www.w3.org/2000/svg"
        {...params}
      >
        <path
          d="M229 895h-18a1 1 0 000 2h18a1 1 0 100-2zm0 8h-18a1 1 0 000 2h18a1 1 0 100-2zm-18-14h18a1 1 0 100-2h-18a1 1 0 000 2z"
          transform="translate(-210 -887)"
          fill="#000"
          stroke="none"
          strokeWidth={1}
          fillRule="evenodd"
        />
      </svg>
    )
  }