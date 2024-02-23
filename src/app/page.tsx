import H1 from "@/components/ui/H1";
import { Metadata } from "next";
import Image from "next/image";
import me from "@/assets/images/cv.jpg";
import H2 from "@/components/ui/H2";
import { Bot } from "lucide-react";

export const metadata: Metadata = {
  title: "Kaung Min Khant - My smart portfolio",
};
export default function Home() {
  return (
    <div className="h-full flex flex-col justify-center">
      <section className="space-y-16 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat px-1 py-8">
        <section className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2 sm:gap-16">
          <div className="space-y-3">
            <H1 className="text-center sm:text-start">
              Hi, I&apos;m Kaung Min Khant
            </H1>
            <p className="text-center sm:text-start">
              I am a full stack developer from Myanmar, learning new
              technologies, and building projects with them.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src={me}
              alt="my photo"
              width={300}
              height={300}
              className="aspect-square h-auto w-auto rounded-full border-2 object-cover shadow-md dark:border-foreground"
            />
          </div>
        </section>
        <section className="space-y-3 text-center">
          <H2>Ask the chatbot anything about me</H2>
          <p>
            Click the little <Bot className="inline pb-1" /> icon in the top bar
            to activate the AI chat. You can ask the chatbot any questions about
            me.
          </p>
        </section>
      </section>
    </div>
  );
}
