import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow w-full max-w-4xl p-4 md:p-6 flex items-center justify-center">
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl text-center">¡Ya estamos en la AppStore!</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4">
                <a href="https://apps.apple.com/app/id6748416303" target="_blank" rel="noopener noreferrer">
                    <Image 
                        src="https://placehold.co/250x84.png" 
                        alt="Descargar en la App Store" 
                        width={250} 
                        height={84}
                        data-ai-hint="app store button" 
                        className="transition-transform hover:scale-105"
                    />
                </a>
                <Link href="/cargar">
                    <Button variant="outline">O continúa en la versión web</Button>
                </Link>
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
