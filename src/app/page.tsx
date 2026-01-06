import Link from 'next/link';
import { MODE_CONFIGS } from '@/lib/prompts';
import { SignInButton } from '@/components/SignInButton';
import { UserButton } from '@/components/UserButton';
import { currentUser } from '@clerk/nextjs/server';

export default async function HomePage() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                OSINT VISION
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-400 hidden sm:block">
                    {user.emailAddresses[0]?.emailAddress}
                  </span>
                  <UserButton />
                </>
              ) : (
                <SignInButton />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-20">
          <div className="mb-6 inline-block animate-bounce">
            <span className="text-6xl">🔍</span>
          </div>

          <h1 className="text-6xl font-black mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            OSINT VISION
          </h1>

          <p className="text-xl text-green-500 font-mono mb-8 tracking-widest">
            AI-POWERED IMAGE INTELLIGENCE PLATFORM
          </p>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Professional OSINT tool for security researchers. Analyze images using
            advanced AI to extract intelligence about people, locations, military equipment,
            and documents.
          </p>

          <Link
            href="/analyze"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-green-600 font-lg rounded-full hover:bg-green-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
          >
            Start Analysis →
            <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 animate-pulse"></div>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-20 relative z-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MODE_CONFIGS.map((mode) => (
              <div
                key={mode.id}
                className="bg-gray-800/50 backdrop-blur border border-gray-700 p-6 rounded-xl hover:bg-gray-800 transition-colors"
              >
                <div className="text-4xl mb-4">{mode.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{mode.name}</h3>
                <p className="text-sm text-gray-400">{mode.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-gray-800/30 w-full py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12 text-white">Platform Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="text-4xl mb-4 text-blue-400">🤖</div>
                <h3 className="text-xl font-bold mb-2">Claude Vision AI</h3>
                <p className="text-gray-400">Powered by Claude Sonnet 4.5 for deep contextual analysis and reasoning.</p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4 text-green-400">📊</div>
                <h3 className="text-xl font-bold mb-2">Metadata Extraction</h3>
                <p className="text-gray-400">Automatic extraction of EXIF data, GPS coordinates, and technical details.</p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4 text-purple-400">📄</div>
                <h3 className="text-xl font-bold mb-2">Professional Reports</h3>
                <p className="text-gray-400">Generate detailed PDF, JSON, or TXT reports for your investigation documentation.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ethical Use Warning */}
        <div className="max-w-4xl mx-auto px-4 py-20 text-center relative z-10">
          <div className="bg-red-900/10 border border-red-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center justify-center gap-2">
              <span>⚖️</span> ETHICAL USE ONLY
            </h2>
            <p className="text-gray-300 mb-4">
              This tool is designed exclusively for authorized security research,
              law enforcement with proper authority, journalism, and academic purposes.
            </p>
            <p className="text-sm text-red-400/80">
              Misuse for stalking, harassment, or privacy violations is strictly prohibited
              and may be illegal under GDPR, LOPD, and international law.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 py-8 text-center text-sm text-gray-600 border-t border-gray-900">
        <p>Built by @bcansan | Open Source Intelligence Tool | v1.0</p>
      </footer>
    </div>
  );
}
