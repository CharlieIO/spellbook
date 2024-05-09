import Link from 'next/link';
import Image from 'next/image';
import witch from '/public/witch2.webp';
import { Button } from '@/components/ui/button';
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/4lZsnpPcLx1
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Home() {
  return (
    <div className="hero bg-base-200 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-24">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-x-8 2xl:gap-x-24 pt-8 sm:pt-16 md:min-h-screen">
        <div className="text-center lg:text-left mx-auto max-w-4xl">
          <h1 className="relative inline-block">
            <span className="text-5xl lg:text-6xl 2xl:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Spellbook
            </span>
            <svg width="0" height="0">
              <defs>
                <filter id="f1" x="0" y="0">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
                </filter>
              </defs>
            </svg>
            <span className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary opacity-35 filter blur-xl"></span>
          </h1>
          <p className="py-6 text-base lg:text-lg 2xl:text-xl">
            Turn your notes into flashcards, study guides, quizzes, and more. Magically.
          </p>
          <div className="flex gap-3">
            <Link href="/login">
              <Button className="mb-8 md:mb-12 sm:mb-10 lg:mb-0">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button 
                className="mb-8 md:mb-12 sm:mb-10 lg:mb-0"
                variant="outline"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative w-full sm:w-3/4 md:w-2/3 lg:max-w-2xl 2xl:max-w-3xl mx-4 lg:mx-8 2xl:mx-12" style={{ height: 'auto' }}>
          <span className="absolute -inset-4 blur-3xl filter bg-gradient-to-r from-primary to-secondary opacity-30 rounded-lg z-0"></span>
          <Image  
            alt="A witch casts spells on notes."
            className="rounded-lg transition-all duration-500 ease-in-out w-full h-full z-10 relative"
            src={witch}
          />
        </div>
      </div>
    </div>
  )
}
