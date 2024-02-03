import { useState } from "react";
import { toast } from "sonner";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_FILE_SIZE } from "@/lib/validation";

const usePreviewImage = () => {
  const [selectedFile, setSelectedFile] = useState<string | ArrayBuffer | null>(null);
  const [selectedFileError,setSelectedFileError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setSelectedFileError(".jpg, .jpeg, .png and .webp files are accepted.");
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_IMAGE_FILE_SIZE) {
      setSelectedFile("Image must be less than 5MB");
      setSelectedFile(null);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setSelectedFile(reader.result);
      setSelectedFileError("");
    };
    reader.onerror = () => {
      setSelectedFileError("Unable to load image file");
      setSelectedFile(null);
    };
  };

  return { selectedFile, setSelectedFile, selectedFileError, setSelectedFileError, handleImageChange };
};

export { usePreviewImage };