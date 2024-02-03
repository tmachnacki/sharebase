import { useState, useRef, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUserProfileStore } from "@/store/userProfileStore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CloseIcon } from "@/components/shared/close-icon";
import {
  EditProfileValidationSchema,
  ACCEPTED_IMAGE_TYPES,
  MAX_PROFILE_FILE_SIZE,
} from "@/lib/validation";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserDocument } from "@/types";
import { toast } from "sonner";
import { ButtonLoader } from "../shared/button-loader";
import { Skeleton } from "../ui/skeleton";

import { FileWithPath, useDropzone } from "react-dropzone";
import { convertFileToUrl, toBase64 } from "@/lib/utils";
import { ProfileUploader } from "./profile-uploader";

type EditProfileProps = {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
};

function getImageData(event: React.ChangeEvent<HTMLInputElement>) {
  // FileList is immutable, so we need to create a new one
  const dataTransfer = new DataTransfer();

  // Add newly uploaded images
  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image)
  );

  const files = dataTransfer.files;
  const displayUrl = event.target.files
    ? URL.createObjectURL(event.target.files![0])
    : "";

  return { files, displayUrl };
}

const EditProfile = ({ isOpen, onOpenChange, onClose }: EditProfileProps) => {
  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | ArrayBuffer | null>(
    null
  );
  const [selectedFileError, setSelectedFileError] = useState("");
  // const { selectedFile, handleImageChange, setSelectedFile } = usePreviewImage();

  // const [previewImageUrl, setPreviewImageURl] = useState("");

  const fileRef = useRef<HTMLInputElement | null>(null);

  const authUserProfileFile = authUser?.profilePicUrl;

  const EditProfileFormSchema = EditProfileValidationSchema;
  const form = useForm<z.infer<typeof EditProfileFormSchema>>({
    resolver: zodResolver(EditProfileFormSchema),
    defaultValues: {
      // profilePic: [],
      fullName: authUser?.fullName ?? "",
      username: authUser?.username ?? "",
      bio: authUser?.bio ?? "",
    },
  });

  async function onSubmit(userData: z.infer<typeof EditProfileFormSchema>) {
    console.log("data", userData, selectedFile);

    if (!authUser) return;

    const storageRef = ref(storage, `profilePics/${authUser.uid}`);
    const userDocRef = doc(firestore, "users", authUser.uid);

    let URL = "";
    try {
      if (selectedFile) {
        await uploadString(storageRef, selectedFile.toString(), "data_url");
        URL = await getDownloadURL(ref(storage, `profilePics/${authUser.uid}`));
      }

      const updatedUser: UserDocument = {
        fullName: userData?.fullName ?? authUser.fullName,
        username: userData?.username ?? authUser.username,
        bio: userData?.bio ?? authUser.bio,
        profilePicUrl: URL ? URL : authUser.profilePicUrl,

        createdAt: authUser.createdAt,
        email: authUser.email,
        followers: authUser.followers,
        following: authUser.following,
        posts: authUser.posts,
        profileBannerUrl: authUser.profileBannerUrl,
        saves: authUser.saves,
        uid: authUser.uid,
      };

      await updateDoc(userDocRef, updatedUser);
      localStorage.setItem("user-info", JSON.stringify(updatedUser));
      setAuthUser(updatedUser);
      setUserProfile(updatedUser);
      onClose();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error", { description: `${error}` });
    }
  }

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

    if (file.size > MAX_PROFILE_FILE_SIZE) {
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

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Profile</AlertDialogTitle>
        </AlertDialogHeader>

        {/* form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* <FormField
              control={form.control}
              name="profilePic"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel className="sr-only">Profile Picture</FormLabel>
                  <FormControl >
                    <div className="flex flex-row items-center gap-8">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={previewImageUrl || authUser?.profilePicUrl} className="object-cover w-full h-full" />
                        <AvatarFallback>{authUser?.username}</AvatarFallback>
                      </Avatar>
                      <Input
                        type="file"
                        className="block w-full h-auto p-0 align-middle border rounded-lg cursor-pointer disabled:opacity-50 disabled:pointer-events-none file:bg-slate-900 file:text-slate-50 file:hover:bg-slate-900/90 file:border-0 file:me-4 file:px-4 dark:file:bg-slate-50 dark:file:text-slate-900 dark:file:hover:bg-slate-50/90 file:py-2"
                        {...rest}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          if(!event.target.files) return;
                          onChange(event.target.files[0]);
                          handleImageChange(event);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="space-y-2">
              <div className="flex flex-row items-center gap-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={selectedFile || authUser?.profilePicUrl}
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback>
                    {selectedFile || authUser?.profilePicUrl ? (
                      <Skeleton className="w-full h-full rounded-full" />
                    ) : (
                      authUser?.fullName
                    )}
                  </AvatarFallback>
                </Avatar>
                <Button
                  className="w-full"
                  variant={"outline"}
                  type="button"
                  onClick={(
                    e:
                      | React.MouseEvent<HTMLButtonElement>
                      | React.TouchEvent<HTMLButtonElement>
                  ) => {
                    e.preventDefault();
                    fileRef?.current ? fileRef?.current.click() : null;
                  }}
                >
                  Edit Profile Picture
                </Button>

                <Input
                  type="file"
                  className="hidden"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </div>
              <FormMessage>
                {selectedFileError && selectedFileError}
              </FormMessage>
            </div>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  onClose();
                }}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <ButtonLoader />}
                Submit
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
        {/* end form */}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { EditProfile };
