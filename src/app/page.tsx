import { Header } from '@/components/header';
import { SplitItRightApp } from '@/components/split-it-right-app';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow w-full max-w-4xl p-4 md:p-6">
        <SplitItRightApp />
      </main>
      <footer className="w-full p-4 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Split It Right. All rights reserved.</p>
      </footer>
    </div>
  );
}
