"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ListingImage } from "@/lib/types";

type ListingGalleryProps = {
  images: ListingImage[];
  title: string;
};

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const hasThreePhotoLayout = images.length >= 3;
  const mainImage = images[0];
  const secondaryImages = hasThreePhotoLayout ? images.slice(1, 3) : [];
  const thumbnailImages = hasThreePhotoLayout ? images.slice(3) : images.slice(1);
  const selectedImage = selectedIndex === null ? null : images[selectedIndex];
  const selectedPhotoNumber = selectedIndex === null ? 0 : selectedIndex + 1;

  function openImage(index: number) {
    setSelectedIndex(index);
  }

  function closeImage() {
    setSelectedIndex(null);
  }

  function showPrevious() {
    setSelectedIndex((current) => {
      if (current === null) {
        return null;
      }

      return current === 0 ? images.length - 1 : current - 1;
    });
  }

  function showNext() {
    setSelectedIndex((current) => {
      if (current === null) {
        return null;
      }

      return current === images.length - 1 ? 0 : current + 1;
    });
  }

  if (!mainImage) {
    return (
      <section className="overflow-hidden rounded-lg">
        <div className="flex min-h-[320px] items-center justify-center bg-fog text-sm text-zinc-500">Bez fotografie</div>
      </section>
    );
  }

  return (
    <section>
      {hasThreePhotoLayout ? (
        <div className="grid gap-1 overflow-hidden rounded-lg md:grid-cols-2">
          <GalleryButton image={mainImage} title={title} index={0} priority className="min-h-[320px] md:min-h-[620px]" onOpen={openImage} />

          <div className="grid gap-1">
            {secondaryImages.map((image, index) => (
              <GalleryButton
                key={image.id}
                image={image}
                title={title}
                index={index + 1}
                className="min-h-[230px] md:min-h-0"
                onOpen={openImage}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg">
          <GalleryButton image={mainImage} title={title} index={0} priority className="min-h-[320px] md:min-h-[620px]" onOpen={openImage} />
        </div>
      )}

      {thumbnailImages.length > 0 ? (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {thumbnailImages.map((image) => {
            const imageIndex = images.findIndex((item) => item.id === image.id);

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => openImage(imageIndex)}
                className="relative aspect-square overflow-hidden rounded-lg border border-line bg-fog focus:outline-none focus:ring-2 focus:ring-moss"
                aria-label={`Zobrazit fotografii ${imageIndex + 1}`}
              >
                <Image src={image.image_url} alt={`${title} - fotografie ${imageIndex + 1}`} fill sizes="120px" className="object-cover" />
              </button>
            );
          })}
        </div>
      ) : null}

      {selectedImage ? (
        <div className="fixed inset-0 z-50 bg-black/90 px-3 py-4 text-white sm:px-6" role="dialog" aria-modal="true">
          <div className="mx-auto flex h-full max-w-6xl flex-col">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">
                Fotografie {selectedPhotoNumber} z {images.length}
              </p>
              <button
                type="button"
                onClick={closeImage}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                aria-label="Zavřít galerii"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <Image src={selectedImage.image_url} alt={`${title} - fotografie ${selectedPhotoNumber}`} fill sizes="100vw" className="object-contain" priority />

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    className="absolute left-0 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 sm:left-4"
                    aria-label="Předchozí fotografie"
                  >
                    <ChevronLeft className="h-7 w-7" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="absolute right-0 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 sm:right-4"
                    aria-label="Další fotografie"
                  >
                    <ChevronRight className="h-7 w-7" aria-hidden="true" />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function GalleryButton({
  image,
  title,
  index,
  priority = false,
  className,
  onOpen
}: {
  image: ListingImage;
  title: string;
  index: number;
  priority?: boolean;
  className: string;
  onOpen: (index: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className={`relative block w-full bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-moss ${className}`}
      aria-label={`Zobrazit fotografii ${index + 1}`}
    >
      <Image src={image.image_url} alt={`${title} - fotografie ${index + 1}`} fill priority={priority} sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
    </button>
  );
}
