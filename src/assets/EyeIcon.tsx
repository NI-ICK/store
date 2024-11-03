export function EyeIcon({ params }: { params?: React.SVGProps<SVGSVGElement> }) {
return (
    <svg
    width="1rem"
    height="1rem"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...params}
    >
    <g
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M2.42 12.713c-.136-.215-.204-.323-.242-.49a1.173 1.173 0 010-.446c.038-.167.106-.274.242-.49C3.546 9.505 6.895 5 12 5s8.455 4.505 9.58 6.287c.137.215.205.323.243.49.029.125.029.322 0 .446-.038.167-.106.274-.242.49C20.455 14.495 17.105 19 12 19c-5.106 0-8.455-4.505-9.58-6.287z" />
        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    </g>
    </svg>
)
}