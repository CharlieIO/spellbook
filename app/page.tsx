import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <section className="w-full py-8 md:py-12 lg:py-24 xl:py-32">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-8 mb-8 md:mb-12">
          <div className="flex flex-col items-center md:items-start justify-center space-y-6 md:space-y-8 text-center md:text-left md:w-1/2">
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">Spellbook</h1>
              <p className="max-w-[90%] mx-auto md:mx-0 text-sm md:text-base lg:text-lg text-muted-foreground md:max-w-[500px]">
                Turn your notes into flashcards, study guides, quizzes, and more. Magically.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/signup">
                  Sign Up
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/login">
                  Log In
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/witch2.webp"
              alt="Witch using Spellbook"
              width={400}
              height={400}
              className="rounded-lg shadow-lg w-full max-w-sm lg:max-w-md"
            />
          </div>
        </div>
        <div className="grid w-full max-w-2xl mx-auto grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
                  <path d="M15 3v4a2 2 0 0 0 2 2h4" />
                </svg>
              ),
              title: "Note-taking",
              description: "Upload your handwritten notes for easy organization and access.",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
                </svg>
              ),
              title: "Quiz Generation",
              description: "Automatically create quizzes from your notes to test your knowledge.",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v.5" />
                  <path d="M12 10v4h4" />
                  <path d="m12 14 1.535-1.605a5 5 0 0 1 8 1.5" />
                  <path d="M22 22v-4h-4" />
                  <path d="m22 18-1.535 1.605a5 5 0 0 1-8-1.5" />
                </svg>
              ),
              title: "Study Aids",
              description: "Generate flashcards and summaries based on your notes and quiz performance.",
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-lg">
              {item.icon}
              <p className="text-xl font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground text-center">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
