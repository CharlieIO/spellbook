'use client'
import { JSX, SVGProps } from "react"
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import UserButtonComponent from "@/components/userbutton"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"

export default function NavBar() {
  return (
    <header className="flex h-16 items-center justify-between px-4 md:px-6 border-b bg-background">
      <a href="/home" className="flex items-center gap-2">
        <BookIcon className="h-6 w-6" />
        <span className="text-lg font-semibold hidden sm:block">Spellbook</span>
      </a>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5m-16.5 6h16.5m-16.5 6h16.5" />
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent className="flex flex-col items-center bg-background">
            <NavigationMenu>
              <NavigationMenuList className="flex flex-col space-y-4">
                <NavigationMenuItem>
                  <NavigationMenuLink href="/classes" className={`${navigationMenuTriggerStyle()} bg-background text-xl py-2`}>
                    My Classes
                  </NavigationMenuLink> 
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/quizzes" className={`${navigationMenuTriggerStyle()} bg-background text-xl py-2`}>
                    Practice Quizzes
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <UserButtonComponent />
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:flex justify-center w-full">
        <NavigationMenu>
          <NavigationMenuList className="flex justify-center space-x-8">
            <NavigationMenuItem>
              <NavigationMenuLink href="/classes" className={`${navigationMenuTriggerStyle()} bg-background`}>
                My Classes
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/quizzes" className={`${navigationMenuTriggerStyle()} bg-background`}>
                Practice Quizzes
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="hidden md:block">
        <UserButtonComponent />
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
