import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow w-full max-w-4xl p-4 md:p-6 flex items-center justify-center">
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl text-center">¡Ya estamos en la AppStore!</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-6 p-8">
                <a href="https://apps.apple.com/app/id6748416303" target="_blank" rel="noopener noreferrer" className="inline-block transition-transform hover:scale-105" aria-label="Disponible en el App Store">
                  <svg width="250" height="74" viewBox="0 0 250 74" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="250" height="74" rx="14" fill="black"/>
                    <path d="M36.5 19C37.8807 19 39 20.1193 39 21.5V52.5C39 53.8807 37.8807 55 36.5 55H23.5C22.1193 55 21 53.8807 21 52.5V21.5C21 20.1193 22.1193 19 23.5 19H36.5Z" stroke="white" strokeWidth="2"/>
                    <path d="M28 23H32" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="30" cy="50" r="2" fill="white"/>
                    <text x="155" y="34" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="500" fill="white" textAnchor="middle">Disponible en el</text>
                    <text x="155" y="60" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="700" fill="white" textAnchor="middle">App Store</text>
                  </svg>
                </a>
            </CardContent>
        </Card>
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
