import { ChevronLeft } from "lucide-react"

interface HeaderProps {
  title: string
  onBack: () => void
}

export function Header({ title, onBack }: HeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <button onClick={onBack} className="p-1">
        <ChevronLeft className="h-6 w-6" />
      </button>

      <div className="flex items-center">
        <div className="bg-blue-500 rounded-full p-1 mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span className="text-lg font-medium">{title}</span>
      </div>

      <button className="text-gray-500">说明</button>
    </div>
  )
}

