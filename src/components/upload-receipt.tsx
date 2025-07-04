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

// This component is rendered inside a <form> and can use useFormStatus
function FormContents() {
  const [preview, setPreview] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { pending } = useFormStatus();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Original file size: ${Math.round(file.size / 1024)} KB`);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) return;
        
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) return;

          ctx.drawImage(img, 0, 0, width, height);
          
          // Use JPEG for better compression of photos, with a quality of 75%
          const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
          const dataUriSizeInKB = Math.round(dataUrl.length / 1024);
          console.log(`Compressed data URI size: ${dataUriSizeInKB} KB`);
          
          setPreview(dataUrl);
          setPhotoDataUri(dataUrl);
        };
        img.src = e.target.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectFileClick = () => {
    if (pending) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div
        onClick={handleSelectFileClick}
        className={`relative flex flex-col items-center justify-center w-full h-64 p-4 border-2 border-dashed rounded-lg text-muted-foreground transition-colors ${pending ? 'cursor-not-allowed bg-muted/50' : 'cursor-pointer hover:bg-accent/50 hover:border-primary'}`}
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
    </div>
  );
}


export function UploadReceipt({ formAction }: UploadReceiptProps) {
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Dividir una Nueva Cuenta</CardTitle>
        <CardDescription>Sube una foto de tu recibo para comenzar.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FormContents />
        </form>
      </CardContent>
    </Card>
  );
}
