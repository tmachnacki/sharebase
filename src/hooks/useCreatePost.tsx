import { useState } from "react";
import { toast } from "sonner";


const useCreatePost = () => {
  const [isPostPending, setIsPostPending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | ArrayBuffer | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [errors, setErrors] = useState({
    selectedFile: "",
    caption: "",
    tags: ""
  });

  


}

export { useCreatePost };