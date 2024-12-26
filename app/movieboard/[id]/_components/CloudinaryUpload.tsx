"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  currentImage: string | null;
  uploadPreset: string;
  type: "cover" | "profile";
  isAuthorised: boolean;
}

export default function CloudinaryUpload({
  onUpload,
  currentImage,
  uploadPreset,
  type,
  isAuthorised,
}: CloudinaryUploadProps) {
  if (!isAuthorised)
    return (
      <div>
        {currentImage ? (
          <Image
            src={currentImage}
            alt="Cover Image"
            width={500}
            height={500}
            className={`aspect-square w-full object-cover ${type === "cover" ? "rounded-lg" : "size-72 rounded-full"}`}
          />
        ) : (
          <div
            className={`flex aspect-square w-full items-center justify-center ${type === "cover" ? "rounded-lg" : "size-72 rounded-full"} bg-muted`}
          >
            <p className="text-wrap text-xs text-muted-foreground">
              Click to add {type === "cover" ? "cover image" : "profile image"}
            </p>
          </div>
        )}
      </div>
    );

  return (
    <CldUploadWidget
      options={{
        sources: ["local", "url"],
        clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
      }}
      uploadPreset={uploadPreset}
      onSuccess={async (result, widget) => {
        if (result.event !== "success") return;
        const info = result.info as { secure_url: string };
        await onUpload(info.secure_url);
        widget.close();
      }}
    >
      {({ open }) => (
        <div onClick={() => open()} className="cursor-pointer">
          {currentImage ? (
            <Image
              src={currentImage}
              alt="Cover Image"
              width={500}
              height={500}
              className={`aspect-square w-full object-cover ${type === "cover" ? "rounded-lg" : "size-72 rounded-full"}`}
            />
          ) : (
            <div
              className={`flex aspect-square w-full items-center justify-center ${type === "cover" ? "rounded-lg" : "size-72 rounded-full"} bg-muted`}
            >
              <p className="text-wrap text-xs text-muted-foreground">
                Click to add{" "}
                {type === "cover" ? "cover image" : "profile image"}
              </p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
}
