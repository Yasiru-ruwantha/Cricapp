import { Button } from "@/components/ui/button";
import { 
  Activity, ArrowRight, BarChart3, ChevronRight, Shield, TrendingUp, Users, Zap,
  CalendarCheck, Trophy, BarChart2, Medal, Radio, CalendarDays
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative flex items-center min-h-[400px] overflow-hidden bg-gradient-to-r from-[#0B172A] to-[#000C20] text-white">
        {/* Abstract background shapes and image placeholder */}
        <div className="absolute right-0 top-0 h-full w-2/3 md:w-1/2 bg-black/20 rounded-l-[100%] mix-blend-overlay"></div>
        <div className="absolute right-[-10%] top-0 h-full w-[60%] opacity-30 mix-blend-luminosity bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>

        <div className="container mx-auto px-6 relative z-10 py-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-4 text-white drop-shadow-md">
              We make <span className="font-bold">grassroots cricketers</span> heroes; one match at a time.
            </h1>
            <p className="text-lg md:text-xl mb-6 text-red-50">
              Download the award winning app and start <span className="font-bold">scoring for free.</span>
            </p>
            
            {/* App Store Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              {/* Play Store Button Mock */}
              <Link href="#" className="bg-black rounded-lg px-5 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-900 border border-gray-800 transition-colors">
                 <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.148 2.502L25.32 24.316L4.148 46.128C3.784 45.748 3.5 45.188 3.5 44.484V4.146C3.5 3.444 3.784 2.884 4.148 2.502Z" fill="#00D4FA"/>
                    <path d="M33.092 32.32L25.32 24.316L4.148 46.128C4.78 46.78 5.726 47.01 6.84 46.38L33.092 32.32Z" fill="#FF334B"/>
                    <path d="M33.092 16.31L6.84 2.25C5.726 1.62 4.78 1.85 4.148 2.502L25.32 24.316L33.092 16.31Z" fill="#00E676"/>
                    <path d="M33.092 32.32L43.432 26.78C45.2 25.834 45.2 24.28 43.432 23.332L33.092 16.31L25.32 24.316L33.092 32.32Z" fill="#FFC900"/>
                </svg>
                 <div className="flex flex-col text-left">
                    <span className="text-[10px] text-gray-300 uppercase leading-none font-semibold tracking-wide">GET IT ON</span>
                    <span className="text-xl font-semibold leading-tight text-white mt-0.5">Google Play</span>
                 </div>
              </Link>
              {/* App Store Button Mock */}
              <Link href="#" className="bg-black rounded-lg px-5 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-900 border border-gray-800 transition-colors">
                 <svg className="w-8 h-8" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M255.4 181.2C253.7 149.3 277 122.5 303.4 116C306.7 148 279 176.6 255.4 181.2Z" fill="white"/>
                    <path d="M352.5 369.3C340.2 391 328.6 411.3 306.9 411.5C285.2 411.7 278.4 398.3 253.5 398.3C228.6 398.3 220.8 411.3 200.1 411.5C179.4 411.7 166 389.2 153.6 371.3C128.2 334.6 109 265.4 135 220.5C147.9 198.3 169.8 184 193.3 183.8C214.1 183.6 233.9 198.1 246.6 198.1C259.4 198.1 283.4 180.6 308.8 181C319.4 181.2 349.5 185.3 369.3 214.3C367.6 215.3 333.6 235.2 333.8 274.6C334 321.4 374.3 337 375.3 337.5C374.5 339.7 366.5 366.9 352.5 369.3Z" fill="white"/>
                 </svg>
                 <div className="flex flex-col text-left">
                    <span className="text-[10px] text-gray-300 uppercase leading-none font-semibold tracking-wide">Download on the</span>
                    <span className="text-xl font-semibold leading-tight text-white mt-0.5">App Store</span>
                 </div>
              </Link>
            </div>

            {/* Ratings */}
            <div className="flex flex-wrap gap-8 items-center pt-2">
              <div className="flex items-center gap-3">
                {/* Editor's choice mock icon */}
                <div className="w-14 h-14 rounded-full border border-white flex items-center justify-center text-white relative bg-red-900/40">
                   <Shield className="w-6 h-6" />
                </div>
                <div className="text-sm">
                  <div className="font-bold text-lg text-white">4.8 Ratings</div>
                  <div className="text-white">4Cr+ Downloads</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Star rating mock icon */}
                <div className="w-14 h-14 flex flex-col items-center justify-center relative">
                   <div className="flex text-white absolute bottom-1">
                      <span className="text-sm leading-none">★</span>
                      <span className="text-lg leading-none -mt-2">★</span>
                      <span className="text-xl leading-none -mt-4">★</span>
                      <span className="text-lg leading-none -mt-2">★</span>
                      <span className="text-sm leading-none">★</span>
                   </div>
                   <div className="w-6 h-6 rounded bg-white text-red-600 flex items-center justify-center absolute -bottom-2 -right-1 shadow">
                       <span className="font-bold text-[10px]">👍</span>
                   </div>
                </div>
                <div className="text-sm">
                  <div className="font-bold text-lg text-white">4.7 Ratings</div>
                  <div className="text-white">60L+ Downloads</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-light font-manrope text-blue-950 dark:text-red-500 mb-4">
              Why <span className="font-bold">Cricapp?</span>
            </h2>
            <p className="text-lg text-slate-600 font-manrope dark:text-slate-400">
              Powerful tools designed specifically for cricket organizers, players, and fans.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900 p-8  border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-xl flex items-center justify-center mb-6">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-l font-bold text-slate-900 font-manrope dark:text-white mb-3">Match Management</h3>
              <p className="text-slate-600 text-sm dark:text-slate-400 font-manrope">
                Create, schedule and manage cricket matches effortlessly. Keep track of all game details in one place.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900 p-8  border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-xl flex items-center justify-center mb-6">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-l font-bold text-slate-900 font-manrope dark:text-white mb-3">Tournament Management</h3>
              <p className="text-slate-600 text-sm dark:text-slate-400 font-manrope">
                Create tournaments, manage teams, fixtures and monitor overall competition progress seamlessly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900 p-8  border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 rounded-xl flex items-center justify-center mb-6">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="text-l font-bold text-slate-900 font-manrope dark:text-white mb-3">Player Analytics</h3>
              <p className="text-slate-600 text-sm dark:text-slate-400 font-manrope">
                Understand player performance using meaningful statistics, heatmaps, and historical data.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-slate-900 p-8  border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <Medal className="w-6 h-6" />
              </div>
              <h3 className="text-l font-bold text-slate-900 font-manrope dark:text-white mb-3">Leaderboards</h3>
              <p className="text-slate-600 text-sm dark:text-slate-400 font-manrope">
                Discover top batters, bowlers and all-rounders. Track tournament MVP and individual achievements.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-slate-900 p-8  border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-xl flex items-center justify-center mb-6">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-l font-bold text-slate-900 font-manrope dark:text-white mb-3">Live Match Center</h3>
              <p className="text-slate-600 text-sm dark:text-slate-400 font-manrope">
                Follow live scores and match events in real time. Never miss a ball with our instant updates.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-slate-900 p-8  border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="text-l font-bold text-slate-900 font-manrope dark:text-white mb-3">Smart Scheduling</h3>
              <p className="text-slate-600 text-sm dark:text-slate-400 font-manrope">
                Organize fixtures, dates, venues and teams efficiently with our intelligent scheduling engine.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-emerald-600 text-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute -top-[50%] -right-[10%] w-[50%] h-[150%] rounded-full bg-blue-400 blur-[120px]" />
          <div className="absolute -bottom-[50%] -left-[10%] w-[50%] h-[150%] rounded-full bg-red-500 blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-manrope mb-4 text-white">
              Trusted by the global cricket community
            </h2>
            <p className="text-slate-300 font-manrope">
              Join thousands of organizers and millions of players already using Cricapp.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            {/* Stat 1 */}
            <div className="flex flex-col items-center p-4">
              <span className="text-4xl md:text-5xl font-black font-manrope text-white mb-2">5M+</span>
              <span className="text-sm md:text-base text-slate-400 font-manrope font-semibold uppercase tracking-wider">Matches</span>
            </div>
            
            {/* Stat 2 */}
            <div className="flex flex-col items-center p-4">
              <span className="text-4xl md:text-5xl font-black font-manrope text-white mb-2">150K+</span>
              <span className="text-sm md:text-base text-slate-400 font-manrope font-semibold uppercase tracking-wider">Tournaments</span>
            </div>
            
            {/* Stat 3 */}
            <div className="flex flex-col items-center p-4">
              <span className="text-4xl md:text-5xl font-black font-manrope text-white mb-2">12M+</span>
              <span className="text-sm md:text-base text-slate-400 font-manrope font-semibold uppercase tracking-wider">Players</span>
            </div>
            
            {/* Stat 4 */}
            <div className="flex flex-col items-center p-4">
              <span className="text-4xl md:text-5xl font-black font-manrope text-white mb-2">2M+</span>
              <span className="text-sm md:text-base text-slate-400 font-manrope font-semibold uppercase tracking-wider">Teams</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
