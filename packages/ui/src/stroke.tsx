export default function Stroke({ size }: { size: 'sm' | 'md' | 'lg' }) {

    let width = 1.25;
    if (size === 'sm') {
        width = 1.25;
    } else if (size === 'md') {
        width = 2.5
    } else if (size === 'lg') {
        width = 3
    }
    return (
        <>
            <svg
                aria-hidden="true"
                focusable="false"
                role="img"
                viewBox="0 0 20 20"
                className=""
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path
                    d="M5 10h10"
                    stroke="currentColor"
                    strokeWidth={width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </>
    )
}