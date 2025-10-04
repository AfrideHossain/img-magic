"use client";

import { upload } from "@imagekit/next";
import React, { useState } from "react";

// interface for FileUpload props
interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // optional file validation
  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be lesser than 100 MB.");
    }

    // return
    return true;
  };
  // file change handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
      //get imagekit auth params from api
      const ikAuthParamsRes = await fetch("/api/auth/imagekit-auth");
      const ikAuthParams = await ikAuthParamsRes.json();
      // destructure params
      const { signature, expire, token, publicKey } = ikAuthParams;

      //uploading processing start
      const uploadRes = await upload({
        file,
        fileName: file.name, // Optionally set a custom file name
        expire,
        token,
        signature,
        publicKey,
        // Progress callback to update upload progress state
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percentage = (event.loaded / event.total) * 100;
            onProgress(Math.round(percentage));
          }
        },
      });

      // pass response to onSuccess
      onSuccess(uploadRes);
    } catch (error) {
      console.error("Upload failed ", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
      />
      {uploading && <span>Uploading...</span>}
    </>
  );
};

export default FileUpload;
