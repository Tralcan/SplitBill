import { Header } from '@/components/header';
import { SplitItRightApp } from '@/components/split-it-right-app';
import { Button } from '@/components/ui/button';
import { Coffee } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow w-full max-w-4xl p-4 md:p-6">
        <SplitItRightApp />
      </main>
      <footer className="w-full p-4 border-t text-muted-foreground text-sm">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2025 Developed by Diego Anguita.</p>
          <div className="flex items-center gap-2">
            <p className="italic">Si te gustó, no dudes en</p>
            <a href="https://www.buymeacoffee.com/6hxrhhkvhs2" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-[#FFDD00] text-black hover:bg-[#FFDD00]/90 focus-visible:ring-[#FFDD00]">
                    <Coffee className="mr-2 h-4 w-4" />
                    Cómprame un café
                </Button>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
