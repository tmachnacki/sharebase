import { useState } from "react";
import { toast } from "sonner";

const usePreviewImage = () => {
  const [selectedFile, setSelectedFile] = useState<string | ArrayBuffer | null>(null);
  const maxFileSizeInBytes = 5 * 1024 * 1024; // 5MB

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type.startsWith("image/")) {
      if (file.size > maxFileSizeInBytes) {
        toast.error("Error", { description: "File size must be less than 2MB" });
        setSelectedFile(null);
        return;
      }
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      toast.error("Error", { description: "Please select an image file" });
      setSelectedFile(null);
    }
  };

  return { selectedFile, handleImageChange, setSelectedFile };
};

export { usePreviewImage };