"use client"; // Mark as a Client Component

import { Button } from "@/components/ui/button"; 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; 
import { Input } from "@/components/ui/input"; 
import { WavyBackground } from "@/components/ui/wavy-background"; 
import { SparklesCore } from "@/components/ui/sparkles"; 
import Link from "next/link"; 
import { TypewriterEffect } from "@/components/ui/typewriter-effect"; 
import Image from "next/image";

export default function Home() {
  const words = [
    { text: "Find" },
    { text: "The" },
    { text: "Perfect" },
    { text: "Candidate" },
    { text: "For" },
    { text: "Every" },
    { text: "Role" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Wavy Background */}
   
      {/* Sparkles Effect */}
      <div className="fixed inset-0 w-full h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="fixed inset-0 w-full h-full" // Full screen
          particleColor="#FFFFFF"
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 text-center pt-32">
        <TypewriterEffect words={words} className="text-6xl font-bold mb-6 text-white" />
        <p className="text-lg text-gray-300 mb-8">
          Join thousands of companies and candidates finding the perfect match.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/login">
            <Button className="bg-blue-500 hover:bg-blue-600">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Centered Image Before Footer */}
      <div className="flex justify-center items-center mt-20 mb-10">
        <Image 
          src="/Boy.png" 
          alt="Candidate Searching for Job" 
          width={570} 
          height={570} 
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Job Portal. All rights reserved.
      </footer>
    </div>
  );
}
