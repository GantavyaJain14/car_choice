import React from 'react';
import HorizontalAnimatedGallery from './hero-scroll-animation';

function ComponentDemo() {
  const dummyImages = [
    'https://images.unsplash.com/photo-1717893777838-4e222311630b?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1717618389115-88db6d7d8f77?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1717588604557-55b2888f59a6?w=500&auto=format&fit=crop'
  ];
  return (
    <HorizontalAnimatedGallery images={dummyImages} />
  );
}

export { ComponentDemo as DemoOne };
