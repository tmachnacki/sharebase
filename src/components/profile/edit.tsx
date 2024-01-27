
import { useState, useRef } from "react";
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
} from "@/components/ui/alert-dialog"
import { CloseIcon } from "@/components/shared/close-icon";
import { EditProfileValidationSchema } from "@/lib/validation";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserDocument } from "@/types";
import { toast } from "sonner";

type EditProfileProps = {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  onClose: () => void;
}

const EditProfile = ({ isOpen, onOpenChange, onClose }: EditProfileProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImageFromFile, setSelectedImageFromFile] = useState<string | ArrayBuffer | null>(null);

  const authUser = useAuthStore(state => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
	const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

  const EditProfileFormSchema = EditProfileValidationSchema;
  const form = useForm<z.infer<typeof EditProfileFormSchema>>({
    resolver: zodResolver(EditProfileFormSchema),
    defaultValues: {
      profilePic: undefined,
      fullName: authUser?.fullName ?? "",
      username: authUser?.username ?? "",
      bio: authUser?.bio ?? ""
    }
  })

  async function onSubmit(userData: z.infer<typeof EditProfileFormSchema>) {
    console.log(userData)

    if(isUpdating || !authUser) return;

    setIsUpdating(true);

		const storageRef = ref(storage, `profilePics/${authUser.uid}`);
		const userDocRef = doc(firestore, "users", authUser.uid);

    let URL = "";

    try {
      if(selectedImageFromFile) {
        await uploadString(storageRef, selectedImageFromFile.toString(), "data_url");
        URL = await getDownloadURL(ref(storage, `profilePics/${authUser.uid}`))
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
        uid: authUser.uid
      };

      await updateDoc(userDocRef, updatedUser);
      localStorage.setItem("user-info", JSON.stringify(updatedUser));
      setAuthUser(updatedUser);
      setUserProfile(updatedUser);
      onClose();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error", {description: `${error}`})
    } finally {
      setIsUpdating(false);
    }
  }

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImageFromFile(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setSelectedImageFromFile(null);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Edit Profile
          </AlertDialogTitle>
        </AlertDialogHeader>

        {/* form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="profilePic"
              render={({ field }) => (
                <FormItem>
                  <FormControl >
                    <div className="flex flex-row items-center gap-8">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={selectedImageFromFile || authUser?.profilePicUrl} className="h-full w-full object-cover" />
                        <AvatarFallback>{authUser?.username}</AvatarFallback>
                      </Avatar>

                        <Input
                          type="file"
                          className="cursor-pointer text-center file:hidden"
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          disabled={field.disabled}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            field.onChange(e.target.files);
                            onImageChange(e);
                          }}
                        />

                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <div className="flex flex-row items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={selectedFile || authUser?.profilePicUrl} className="h-full w-full object-cover" />
                  <AvatarFallback>{authUser?.username}</AvatarFallback>
                </Avatar>
                <Button variant={"secondary"} onClick={() => fileRef?.current ? fileRef?.current.click() : null}>Edit Profile Picture</Button>
                <input 
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </div> */}


            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                    />
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
                    <Input
                      type="text"
                      {...field}
                    />
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
                    <Textarea
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => {
                  form.reset();
                  setSelectedImageFromFile(null);
                }}
              >
                  Cancel
                </AlertDialogCancel>
              <Button type="submit" disabled={isUpdating} >
                {isUpdating && <Loader2 className="w-4 h-4 mr-2" />}
                Submit
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
        {/* end form */}
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { EditProfile };