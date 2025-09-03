import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface PhotoCollageProps {
  variant: 'bw' | 'color';
  className?: string;
  photos?: string[]; // Allow custom photos to be passed
  layout?: 'grid' | 'masonry' | 'compact' | 'hero' | 'carousel'; // Add layout option
}

// Black & White photos (Before) - Replace these URLs with your own black & white photo URLs
const bwPhotos = [
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/a77e6674-7742-456e-8d3b-71136866d2b3.png", // bollywood actor
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/f44a38a4-5da2-4c56-bfb3-5f58ef0cef94.png?",
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/21b66fa0-ae23-4020-949d-43a1fb969147.png", // Family portrait
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/1d1e8a9b-f453-43c9-ba1e-2ce890ee2663.png", // Traditional wedding
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/4aea6d17-dbdc-490b-814b-bf02723f7396.png", // Bride portrait
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/825b88b4-46ea-48ba-ba91-e2ee147bd26a.png", // Groom portrait
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/e7f91763-7d9e-46e4-903c-bacd55b97471.png", // Family group
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/8f4b37c6-70f0-4b97-ad41-f8342b541b6e.png", // Wedding ceremony
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/92e6b131-8306-4e1f-9229-093c57b18c51.png", // Traditional attire
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/1cc1140a-1ac5-47bc-9961-cbdefe7bf60a.png", // Couple portrait
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/0573389b-082f-4e3b-a10a-d428c5f808f7.png?", // Bride closeup
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/40dbbc8f-ecac-4e81-b7aa-6f1efe94e1fb.png?", // Wedding celebration
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/original-images/6d49eaf2-f63f-452b-9656-38646ff3a145/0db62fe1-2f98-4dc3-8831-f8f47d69c35d.png", // Family moment
];

// Color photos (After) - Replace these URLs with your colorized photo URLs
const colorPhotos = [
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/9a1e83b6-1b82-42b7-ae58-c13f4b3dfbfa_colorized.png?", // Wedding couple (colorized)
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/f44a38a4-5da2-4c56-bfb3-5f58ef0cef94_colorized.png?",
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/21b66fa0-ae23-4020-949d-43a1fb969147_colorized.png", // Family portrait (colorized)
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/e88e5ac0-c743-4a7e-beae-30f92668a40b_colorized.png", // Traditional wedding (colorized)
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/4aea6d17-dbdc-490b-814b-bf02723f7396_colorized.png", // Bride portrait (colorized)
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/825b88b4-46ea-48ba-ba91-e2ee147bd26a_colorized.png", // Groom portrait (colorized)
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/8439945d-a39a-4938-b754-382b4b1afd0a_colorized.png", // Family group (colorized)
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/8f4b37c6-70f0-4b97-ad41-f8342b541b6e_colorized.png", // Wedding ceremony (colorized)
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/92e6b131-8306-4e1f-9229-093c57b18c51_colorized.png", // Traditional attire (colorized)
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/1cc1140a-1ac5-47bc-9961-cbdefe7bf60a_colorized.png?", // Couple portrait (colorized)
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/0573389b-082f-4e3b-a10a-d428c5f808f7_colorized.png?", // Bride closeup (colorized)
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/40dbbc8f-ecac-4e81-b7aa-6f1efe94e1fb_colorized.png", // Wedding celebration (colorized)
  "https://mfjxcvpvdmlunitptxnj.supabase.co/storage/v1/object/public/colorized-images/6d49eaf2-f63f-452b-9656-38646ff3a145/0db62fe1-2f98-4dc3-8831-f8f47d69c35d_colorized.png", // Family moment (colorized)
];

// Default photos (for backward compatibility)
const defaultPhotos = bwPhotos;

// Fallback photos (same as default for now)
const fallbackPhotos = defaultPhotos;

export const PhotoCollage = ({ variant, className, photos, layout = 'grid' }: PhotoCollageProps) => {
  // Use provided photos, or choose appropriate array based on variant
  const displayPhotos = photos || (variant === 'bw' ? bwPhotos : colorPhotos);
  
  // Use all photos - no rotation
  const featuredPhotos = displayPhotos;
  
  if (layout === 'carousel') {
    return (
      <div className={cn("relative h-full", className)}>
        <div className="flex h-full space-x-4 p-4 overflow-x-auto snap-x snap-mandatory">
          {featuredPhotos.map((photo, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 h-full snap-center"
            >
              <div className="relative w-full h-full overflow-hidden rounded-xl shadow-2xl">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                {/* Photo counter */}
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {index + 1} / {featuredPhotos.length}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (layout === 'hero') {
    return (
      <div className={cn("relative h-full", className)}>
        {/* Main featured photo */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md h-80 overflow-hidden rounded-xl shadow-2xl">
            <img
              src={featuredPhotos[0]}
              alt="Featured photo"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>
        
        {/* Smaller photos in corners */}
        <div className="absolute top-4 left-4 w-24 h-24 overflow-hidden rounded-lg shadow-lg">
          <img
            src={featuredPhotos[1]}
            alt="Photo 2"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        <div className="absolute top-4 right-4 w-24 h-24 overflow-hidden rounded-lg shadow-lg">
          <img
            src={featuredPhotos[2]}
            alt="Photo 3"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        <div className="absolute bottom-4 left-4 w-24 h-24 overflow-hidden rounded-lg shadow-lg">
          <img
            src={featuredPhotos[3]}
            alt="Photo 4"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        <div className="absolute bottom-4 right-4 w-24 h-24 overflow-hidden rounded-lg shadow-lg">
          <img
            src={featuredPhotos[4]}
            alt="Photo 5"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    );
  }
  
  if (layout === 'compact') {
    return (
      <div className={cn(
        "grid grid-cols-4 gap-1 sm:gap-2 p-2 sm:p-3",
        className
      )}>
        {featuredPhotos.map((photo, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-md shadow-md transition-all duration-300 hover:scale-105 bg-gray-100 dark:bg-gray-800"
          >
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="w-full h-auto object-contain"
              loading="lazy"
              onError={(e) => {
                // Fallback to Unsplash photos if custom photos fail to load
                const target = e.target as HTMLImageElement;
                if (target.src !== fallbackPhotos[index]) {
                  target.src = fallbackPhotos[index];
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>
    );
  }
  
  if (layout === 'masonry') {
    return (
      <div className={cn(
        "columns-4 gap-2 sm:gap-3 md:gap-4 p-2 sm:p-4 space-y-2 sm:space-y-3",
        className
      )}>
        {featuredPhotos.map((photo, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 bg-gray-100 dark:bg-gray-800 break-inside-avoid"
          >
                      <img
            src={photo}
            alt={`Photo ${index + 1}`}
            className="w-full h-auto object-contain"
            loading="lazy"
              onError={(e) => {
                // Fallback to Unsplash photos if custom photos fail to load
                const target = e.target as HTMLImageElement;
                if (target.src !== fallbackPhotos[index]) {
                  target.src = fallbackPhotos[index];
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className={cn(
      "grid grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 auto-rows-auto",
      className
    )}>
      {featuredPhotos.map((photo, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 bg-gray-100 dark:bg-gray-800"
        >
          <img
            src={photo}
            alt={`Photo ${index + 1}`}
            className="w-full h-auto object-contain"
            loading="lazy"
            onError={(e) => {
              // Fallback to Unsplash photos if custom photos fail to load
              const target = e.target as HTMLImageElement;
              if (target.src !== fallbackPhotos[index]) {
                target.src = fallbackPhotos[index];
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      ))}
    </div>
  );
};
