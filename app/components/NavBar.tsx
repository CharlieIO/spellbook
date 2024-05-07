'use client'
import { JSX, SVGProps } from "react"
import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs"
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import classNames from 'classnames'

export default function NavBar() {
  return (
    <header className="flex h-16 w-full items-center justify-between px-4 md:px-6 border-b">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink 
              href="/home"
              className={classNames(navigationMenuTriggerStyle(), "flex items-center gap-2 text-lg font-semibold")}
            >
              <BookIcon className="h-6 w-6" />
              <span>Spellbook</span>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/classes" className={navigationMenuTriggerStyle()}>
              My Classes
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
              Insights
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/quizzes" className={navigationMenuTriggerStyle()}>
              Practice Quizzes
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div>
        <ClerkLoaded>
          <UserButton />
        </ClerkLoaded>
        <ClerkLoading>
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-300 h-8 w-8"></div>
          </div>
        </ClerkLoading>
      </div>
    </header>
  )
}

function BookIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
  )
}
