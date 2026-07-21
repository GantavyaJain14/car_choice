'use client';

import { useScroll, useTransform, motion, MotionValue } from 'motion/react';
import React, { useRef } from 'react';

interface GallerySectionProps {
  scrollProgress: MotionValue<number>;
  image: string;
  index: number;
}

const GallerySection: React.FC<GallerySectionProps> = ({ scrollProgress, image, index }) => {
  // Map horizontal progress to specific index ranges
  // For each image, we want it to be "active" at a certain point
  // However, simpler is to just apply transforms based on the image's relative position
  
  // Alternative: Use an intersection observer-like approach with motion
  const scale = useTransform(scrollProgress, [index / 5, (index + 0.5) / 5, (index + 1) / 5], [0.8, 1, 0.8]);
  const rotate = useTransform(scrollProgress, [index / 5, (index + 0.5) / 5, (index + 1) / 5], [-5, 0, 5]);

  return (
    <motion.div
      style={{ scale, rotate }}
      className='flex-none w-[80vw] md:w-[60vw] h-[50vh] md:h-[70vh] relative rounded-3xl overflow-hidden border border-white/10'
    >
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] z-10'></div>
      <img
        src={image}
        alt={`Gallery car ${index}`}
        className='object-cover w-full h-full opacity-90 transition-opacity duration-300'
      />
    </motion.div>
  );
};

export default function HorizontalAnimatedGallery({ images }: { images: string[] }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <div className="w-full">
      <div 
        ref={container} 
        className='flex overflow-x-auto gap-8 px-8 py-12 scrollbar-hide snap-x snap-mandatory'
      >
        {images.map((img, idx) => (
          <div key={idx} className="snap-center">
            <GallerySection 
              index={idx} 
              image={img} 
              scrollProgress={scrollXProgress} 
            />
          </div>
        ))}
      </div>
      
      {/* Decorative footer as seen in the demo */}
      <div className='w-full bg-[#06060e] flex flex-col items-center mt-4'>
        <h2 className='text-[8vw] leading-none uppercase font-semibold text-center bg-gradient-to-r from-gray-400 to-gray-800 bg-clip-text text-transparent opacity-30'>
          FLEET GALLERY
        </h2>
        <div className='bg-black text-white px-12 py-4 mt-[-10px] relative z-10 text-xs tracking-[0.2em] font-light rounded-full border border-white/5'>
          SCROLL TO EXPLORE
        </div>
      </div>
    </div>
  );
}
