import { FileWithPath, useDropzone } from "react-dropzone";

import { convertFileToUrl } from "@/lib/utils";

type ProfileUploaderProps = {
  file: File[];
  setFile: React.Dispatch<React.SetStateAction<File[]>>;
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  fieldChange: (files: File[]) => void;
};

const ProfileUploader = ({
  // file,
  setFile,
  imageUrl,
  setImageUrl,
  fieldChange,
}: ProfileUploaderProps) => {
  const onDrop = (acceptedFiles: FileWithPath[]) => {
    setFile(acceptedFiles);
    fieldChange(acceptedFiles);
    setImageUrl(convertFileToUrl(acceptedFiles[0]));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} className="cursor-pointer" />

      <div className="flex cursor-pointer items-center justify-center gap-4">
        <img
          src={imageUrl}
          alt="image"
          className="h-24 w-24 rounded-full object-cover object-top"
        />
        <p className="text-slate-500 dark:text-slate-400 ">
          Change profile photo
        </p>
      </div>
    </div>
  );
};

export { ProfileUploader };
