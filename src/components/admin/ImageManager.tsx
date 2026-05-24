"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { addProductImage, deleteProductImage } from "@/app/admin/actions";

type Img = { id: string; url: string };

export function ImageManager({
  productId,
  images,
}: {
  productId: string;
  images: Img[];
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${productId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("products")
      .upload(path, file, { upsert: false });
    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("products").getPublicUrl(path);
    await addProductImage(productId, data.publicUrl);
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative h-24 w-24 overflow-hidden rounded-xl border border-ink/10"
          >
            <Image src={img.url} alt="" fill className="object-cover" sizes="96px" />
            <button
              type="button"
              onClick={() => deleteProductImage(img.id, img.url, productId)}
              className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white"
              aria-label="Eliminar imagen"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <label className="mt-3 inline-block cursor-pointer rounded-full border border-brand-orange px-4 py-2 text-sm font-semibold text-brand-orange transition hover:bg-brand-orange/10">
        {uploading ? "Subiendo…" : "Subir imagen"}
        <input
          type="file"
          accept="image/*"
          onChange={onFile}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
