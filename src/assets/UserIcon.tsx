export function UserIcon({ params }: { params?: React.SVGProps<SVGSVGElement> }) {
    return (
        <svg
        className="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="2rem"
        height="2rem"
        fill="none"
        viewBox="0 0 24 24"
        { ...params }
        >
        <path
            stroke="currentColor"
            strokeWidth={1}
            d="M7 17v1a1 1 0 001 1h8a1 1 0 001-1v-1a3 3 0 00-3-3h-4a3 3 0 00-3 3zm8-9a3 3 0 11-6 0 3 3 0 016 0z"
        />
        </svg>
    )
    }