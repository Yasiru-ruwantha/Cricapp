import Link from 'next/link'
import { Trophy } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-slate-300 py-4 border-t border-slate-800 font-manrope">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-white text-brand-dark p-1 rounded-sm">
                  <Trophy className="h-6 w-6" />
              </div>
              <span className="text-2xl font-semibold tracking-tight text-white">Cric<span className="font-bold">App</span></span>
            </Link>
            <p className="text-slate-400 max-w-sm text-sm">
              Smart Cricket Management Platform
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Product</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-white transition-colors">Matches</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Tournaments</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Players</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Analytics</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Leaderboards</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
            </ul>
          </div>

          {/* Company & Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Company</h3>
            <ul className="space-y-3 mb-8">
              <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
            
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-8 pt-5 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p>&copy; 2026 CricApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
