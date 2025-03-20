import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M12 2v20M17 5V2M7 22v-3M7 14v-3M17 19v3M17 14v-3M7 9V5"></path>
        </svg>
      </div>
      <span className="font-bold text-xl text-primary">竹节记</span>
    </Link>
  )
}

