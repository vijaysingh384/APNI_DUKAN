import React from 'react';
import { MediaButton } from '@/components/ui/media-button';

export default function MediaButtonDemo() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-10 bg-muted">
      <MediaButton
        label="Button (Video)"
        mediaUrl="https://www.w3schools.com/howto/rain.mp4"
      />
      <MediaButton
        label="Button (GIF)"
        mediaUrl="https://i.pinimg.com/originals/71/fb/91/71fb9176f16357776802391df14b4e40.gif"
      />
    </div>
  );
}

