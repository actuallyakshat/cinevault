import React from "react";

interface Props {
  video_key: string;
  onClose: Function;
}

const TrailerFrame: React.FC<Props> = ({ video_key, onClose }: Props) => {
  return (
    <div
      onClick={() => onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <iframe
        onClick={(e) => e.stopPropagation()}
        width="900"
        height="500"
        src={
          "https://www.youtube.com/embed/" + video_key + "?autoplay=1&mute=0"
        }
      ></iframe>
    </div>
  );
};

export default TrailerFrame;
