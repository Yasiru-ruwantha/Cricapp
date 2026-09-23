import React from 'react';
import { Activity, Trophy, Calendar, User, FileText, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-tight">CricApp</h1>
          <nav className="space-x-6 text-sm font-medium hidden md:flex">
            <a href="#" className="hover:text-blue-200 transition-colors">Live Score</a>
            <a href="#" className="hover:text-blue-200 transition-colors">Matches</a>
            <a href="#" className="hover:text-blue-200 transition-colors">Tournaments</a>
            <a href="#" className="hover:text-blue-200 transition-colors">Players</a>
            <a href="#" className="hover:text-blue-200 transition-colors">News</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        
        {/* Live Score Hero Widget */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <div>
            <div className="flex items-center gap-2 mb-2 text-red-600 font-semibold text-sm uppercase tracking-wider">
              <Activity className="size-4 animate-pulse" />
              Live Match
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-1">IND vs AUS</h2>
            <p className="text-slate-500 text-sm font-medium">ICC Men's T20 World Cup - Final</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight">
              185/4 <span className="text-2xl md:text-3xl text-slate-400 font-medium">(19.2)</span>
            </div>
            <p className="text-sm font-semibold text-slate-600 mt-2">CRR: 9.61</p>
          </div>
          
          <div className="text-right text-sm md:text-base">
            <p className="font-semibold text-slate-800">VK <span className="text-blue-700">85* (52)</span></p>
            <p className="font-semibold text-slate-800 mt-1">SA <span className="text-blue-700">12* (8)</span></p>
            <p className="text-slate-500 text-xs mt-3">Target: 210</p>
          </div>
        </section>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Matches */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-colors duration-300">
                <Calendar className="size-6" />
              </div>
              <ChevronRight className="text-slate-300 size-5 group-hover:text-blue-900 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">Matches</h3>
            <p className="text-slate-500 text-sm mt-1">View upcoming & recent fixtures.</p>
          </div>

          {/* Tournaments */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-colors duration-300">
                <Trophy className="size-6" />
              </div>
              <ChevronRight className="text-slate-300 size-5 group-hover:text-blue-900 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">Tournaments</h3>
            <p className="text-slate-500 text-sm mt-1">Standings, stats, and series info.</p>
          </div>

          {/* Players */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-colors duration-300">
                <User className="size-6" />
              </div>
              <ChevronRight className="text-slate-300 size-5 group-hover:text-blue-900 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">Players</h3>
            <p className="text-slate-500 text-sm mt-1">Player profiles and rankings.</p>
          </div>

          {/* News */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-colors duration-300">
                <FileText className="size-6" />
              </div>
              <ChevronRight className="text-slate-300 size-5 group-hover:text-blue-900 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">News</h3>
            <p className="text-slate-500 text-sm mt-1">Latest updates and articles.</p>
          </div>

        </div>

        {/* Quick News Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-blue-900">Latest News</h3>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View all <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="space-y-4">
            <article className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Tournament Update</span>
              <h4 className="text-lg font-semibold mt-1 hover:text-blue-800 cursor-pointer transition-colors">Semi-final venues confirmed for the upcoming World Cup</h4>
              <p className="text-slate-500 text-sm mt-1">The ICC has officially announced the host cities for the highly anticipated semi-final clashes...</p>
            </article>
            <article>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Breaking</span>
              <h4 className="text-lg font-semibold mt-1 hover:text-blue-800 cursor-pointer transition-colors">Star player ruled out of the season due to injury</h4>
              <p className="text-slate-500 text-sm mt-1">A major blow to the team as their leading run-scorer is sidelined for the rest of the year...</p>
            </article>
          </div>
        </section>

      </main>
    </div>
  );
}
