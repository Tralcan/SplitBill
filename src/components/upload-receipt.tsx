'use client';

import { useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

type UploadReceiptProps = {
  formAction: (payload: FormData) => void;
};

export function UploadReceipt({ formAction }: UploadReceiptProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { pending } = useFormStatus();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setPreview(dataUri);
        setPhotoDataUri(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Dividir una Nueva Cuenta</CardTitle>
        <CardDescription>Sube una foto de tu recibo para comenzar.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div 
            onClick={handleSelectFileClick}
            className="relative flex flex-col items-center justify-center w-full h-64 p-4 border-2 border-dashed rounded-lg cursor-pointer text-muted-foreground hover:bg-accent/50 hover:border-primary transition-colors"
          >
            <Input
              id="receipt-upload"
              name="receipt-upload"
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              disabled={pending}
            />
            <input type="hidden" name="photoDataUri" value={photoDataUri} />

            {preview ? (
              <Image src={preview} alt="Vista previa del recibo" layout="fill" objectFit="contain" className="rounded-md" />
            ) : (
              <div className="text-center">
                <UploadCloud className="w-12 h-12 mx-auto" />
                <p className="mt-2 font-semibold">Haz clic para subir un recibo</p>
                <p className="text-xs">Se aceptan PNG, JPG o WEBP</p>
              </div>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={!preview || pending}>
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Escanear Artículos del Recibo
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
