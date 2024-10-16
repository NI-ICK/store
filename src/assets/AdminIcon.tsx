export function AdminIcon({ params }: { params?: React.SVGProps<SVGSVGElement> }) {
    return (
      <svg
        className="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="2em"
        height="2em"
        fill="none"
        viewBox="0 0 24 24"
        { ...params }
      >
        <path
          stroke="currentColor"
          strokeLinecap="square"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19H5a1 1 0 01-1-1v-1a3 3 0 013-3h2m10 1a3 3 0 01-3 3m3-3a3 3 0 00-3-3m3 3h1m-4 3a3 3 0 01-3-3m3 3v1m-3-4a3 3 0 013-3m-3 3h-1m4-3v-1m-2.121 1.879l-.707-.707m5.656 5.656l-.707-.707m-4.242 0l-.707.707m5.656-5.656l-.707.707M12 8a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    )
  }