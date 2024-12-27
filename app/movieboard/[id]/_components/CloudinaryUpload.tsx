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
  const imageClasses =
    type === "cover"
      ? "aspect-square w-full rounded-lg object-cover"
      : "w-72 h-72 rounded-full object-cover";

  const placeholderClasses =
    type === "cover"
      ? "aspect-square w-full rounded-lg bg-muted"
      : "w-72 h-72 rounded-full bg-muted";

  if (!isAuthorised)
    return (
      <div className="flex justify-center">
        {currentImage ? (
          <Image
            src={currentImage}
            alt="Cover Image"
            width={500}
            height={500}
            className={imageClasses}
          />
        ) : (
          <div
            className={`flex items-center justify-center ${placeholderClasses}`}
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
        maxFiles: 1,
        multiple: false,
      }}
      uploadPreset={uploadPreset}
      onSuccess={async (result, widget) => {
        if (result.event !== "success") return;
        const info = result.info as { secure_url: string };
        console.log("NEW UPLOAD DONE", info.secure_url);
        await onUpload(info.secure_url);
        widget.close();
      }}
    >
      {({ open }) => (
        <div
          onClick={() => open()}
          className="flex cursor-pointer justify-center"
        >
          {currentImage ? (
            <Image
              src={currentImage}
              alt="Cover Image"
              width={500}
              height={500}
              className={imageClasses}
            />
          ) : (
            <div
              className={`flex items-center justify-center ${placeholderClasses}`}
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
