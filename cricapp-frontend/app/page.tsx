import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-slate-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 mb-4">
          Welcome to CricApp
        </h1>
        <p className="text-lg text-slate-600 dark:text-zinc-400 mb-8 max-w-md">
          Your ultimate destination for live cricket scores, match updates, and player statistics.
        </p>
        
        <Link 
          href="/dashboard" 
          className="inline-flex h-12 items-center justify-center rounded-lg bg-blue-900 px-8 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
        >
          Go to Dashboard
        </Link>
      </main>
    </div>
  );
}
