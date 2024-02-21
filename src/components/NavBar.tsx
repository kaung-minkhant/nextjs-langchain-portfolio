import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import AIChatButton from "./AIChatButton";

export default function NavBar() {
  return (
    <header className="sticky top-0 bg-background">
      <div className="mx-auto flex max-w-3xl flex-wrap justify-between gap-3 px-3 py-4">
        <nav className="space-x-4 font-medium">
          <Link href="/" className="hover:underline">Home</Link>
          {/* <Link href="/about">About</Link>
          <Link href="/social">Social Media</Link> */}
        </nav>
        <div className="flex gap-4 items-center">
          <AIChatButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
