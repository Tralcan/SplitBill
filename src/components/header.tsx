import { ReceiptText } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full p-4 border-b bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <ReceiptText className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground font-headline">MyBill</h1>
      </div>
    </header>
  );
}
