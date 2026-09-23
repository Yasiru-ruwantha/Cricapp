import Link from 'next/link'
import { ChevronDown, Search, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white w-full">
      {/* Left side: Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-blue-950 text-white p-1 rounded-sm">
            <Trophy className="h-6 w-6" />
        </div>
        <span className="text-3xl font-sans  tracking-tight text-black">cric<span className="text-blue-950 text-4xl font-bold">App</span></span>
      </Link>

      {/* Right side: Links & actions */}
      <div className="flex items-center gap-6 text-sm font-bold font-manrope text-gray-900">
        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          <Link href="#" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
            Live scores <ChevronDown className="h-4 w-4 text-gray-900" />
          </Link>
          <Link href="#" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
            Network <ChevronDown className="h-4 w-4 text-gray-900" />
          </Link>
          <Link href="#" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
            Add ons <ChevronDown className="h-4 w-4 text-gray-900" />
          </Link>
          <Link href="#" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
            More <ChevronDown className="h-4 w-4 text-gray-900" />
          </Link>
          <Link href="#" className="hover:text-emerald-600 transition-colors">Store</Link>
          <Link href="#" className="hover:text-emerald-600 transition-colors">Jobs</Link>
          <Link href="#" className="hover:text-emerald-600 transition-colors">Contact us</Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 lg:ml-4">
          <div className="hidden xl:flex items-center gap-2 mr-2">
            {/* Play Store Icon */}
            <Link href="#" className="hover:opacity-80 transition-opacity">
                <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.148 2.502L25.32 24.316L4.148 46.128C3.784 45.748 3.5 45.188 3.5 44.484V4.146C3.5 3.444 3.784 2.884 4.148 2.502Z" fill="#00D4FA"/>
                    <path d="M33.092 32.32L25.32 24.316L4.148 46.128C4.78 46.78 5.726 47.01 6.84 46.38L33.092 32.32Z" fill="#FF334B"/>
                    <path d="M33.092 16.31L6.84 2.25C5.726 1.62 4.78 1.85 4.148 2.502L25.32 24.316L33.092 16.31Z" fill="#00E676"/>
                    <path d="M33.092 32.32L43.432 26.78C45.2 25.834 45.2 24.28 43.432 23.332L33.092 16.31L25.32 24.316L33.092 32.32Z" fill="#FFC900"/>
                </svg>
            </Link>
            {/* App Store Icon */}
            <Link href="#" className="hover:opacity-80 transition-opacity">
                <svg className="w-8 h-8" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="512" height="512" rx="112" fill="#0A84FF"/>
                    <path d="M352.5 369.3C340.2 391 328.6 411.3 306.9 411.5C285.2 411.7 278.4 398.3 253.5 398.3C228.6 398.3 220.8 411.3 200.1 411.5C179.4 411.7 166 389.2 153.6 371.3C128.2 334.6 109 265.4 135 220.5C147.9 198.3 169.8 184 193.3 183.8C214.1 183.6 233.9 198.1 246.6 198.1C259.4 198.1 283.4 180.6 308.8 181C319.4 181.2 349.5 185.3 369.3 214.3C367.6 215.3 333.6 235.2 333.8 274.6C334 321.4 374.3 337 375.3 337.5C374.5 339.7 366.5 366.9 352.5 369.3ZM255.4 181.2C253.7 149.3 277 122.5 303.4 116C306.7 148 279 176.6 255.4 181.2Z" fill="white"/>
                </svg>
            </Link>
          </div>
          
          <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50 hover:text-teal-700 bg-transparent rounded-lg px-6 font-semibold">Sign in</Button>
          
          <button className="text-teal-600 hover:text-teal-700 ml-2">
            <Search className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  )
}
