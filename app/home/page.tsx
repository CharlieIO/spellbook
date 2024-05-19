import React from 'react';
import NavBar from '@/components/navbar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      <NavBar />
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">Spellbook</h1>
                  <p className="max-w-full text-muted-foreground md:text-xl">
                    Spellbook is designed to help you learn more effectively by leveraging your handwritten notes. Here's
                    how it works:
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <BookIcon className="h-6 w-6 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      First, create classes for your different subjects or topics.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <UploadIcon className="h-6 w-6 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Upload your handwritten notes to the corresponding classes.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <QuoteIcon className="h-6 w-6 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Take quizzes generated from your notes to reinforce your understanding.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <UniversityIcon className="h-6 w-6 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Generate study aids like flashcards and summaries based on your notes and quiz performance.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/classes">
                    <Button>
                      Try Spellbook
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <BookIcon className="h-24 w-24 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <div className="mt-8 grid gap-6">
              <div className="flex flex-col items-center justify-center space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Spellbook</h1>
                  <p className="text-lg text-muted-foreground">
                    Spellbook is designed to help you learn more effectively by leveraging your handwritten notes. Here's
                    how it works:
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="flex flex-col items-center gap-4">
                    <BookIcon className="h-12 w-12 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">
                      First, create classes for your different subjects or topics.
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <UploadIcon className="h-12 w-12 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">
                      Upload your handwritten notes to the corresponding classes.
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <QuoteIcon className="h-12 w-12 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">
                      Take quizzes generated from your notes to reinforce your understanding.
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <UniversityIcon className="h-12 w-12 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">
                      Generate study aids like flashcards and summaries based on your notes and quiz performance.
                    </p>
                  </div>
                </div>
                <div>
                  <Link href="/classes">
                    <Button>
                      Try Spellbook
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-full items-center gap-6 lg:grid-cols-2">
            <div className="flex items-center justify-center lg:hidden">
              <UploadIcon className="h-24 w-24 text-muted-foreground" />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Effortless Note-taking</h2>
                <p className="max-w-full text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                  Capture your ideas and thoughts with our intuitive note-taking tools. Handwrite or type your notes,
                  and let our app handle the rest.
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <UploadIcon className="h-24 w-24 text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-full items-center gap-6 lg:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Personalized Quizzes</h2>
                <p className="max-w-full text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                  Spellbook analyzes your notes and creates custom quizzes to help you retain information and identify
                  areas for improvement.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <QuoteIcon className="h-24 w-24 text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-full items-center gap-6 lg:grid-cols-2">
            <div className="flex items-center justify-center lg:hidden">
              <UniversityIcon className="h-24 w-24 text-muted-foreground" />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Personalized Study Plans</h2>
                <p className="max-w-full text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                  Spellbook creates customized study plans based on your note-taking and quiz performance, helping you
                  focus on the areas you need to improve.
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <UniversityIcon className="h-24 w-24 text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function QuoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
}

function UniversityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="10" r="1" />
      <path d="M22 20V8h-4l-6-4-6 4H2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2" />
      <path d="M6 17v.01" />
      <path d="M6 13v.01" />
      <path d="M18 17v.01" />
      <path d="M18 13v.01" />
      <path d="M14 22v-5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5" />
    </svg>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}