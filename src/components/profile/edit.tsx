import { useRef } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditProfileValidationSchema } from "@/lib/validation";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserDocument } from "@/types";
import { toast } from "sonner";
import { ButtonLoader } from "../shared/button-loader";
import { Skeleton } from "../ui/skeleton";
import { usePreviewImage } from "@/hooks/usePreviewImage";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { useIsDesktop } from "@/hooks/useIsDesktop";

type EditProfileProps = {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
};

// function getImageData(event: React.ChangeEvent<HTMLInputElement>) {
//   const dataTransfer = new DataTransfer();

//   Array.from(event.target.files!).forEach((image) =>
//     dataTransfer.items.add(image),
//   );

//   const files = dataTransfer.files;
//   const displayUrl = event.target.files
//     ? URL.createObjectURL(event.target.files![0])
//     : "";

//   return { files, displayUrl };
// }

const EditProfile = ({ isOpen, onOpenChange, onClose }: EditProfileProps) => {
  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

  const { isDesktop } = useIsDesktop();

  const { selectedFile, selectedFileError, handleImageChange } =
    usePreviewImage();

  const fileRef = useRef<HTMLInputElement | null>(null);

  const EditProfileFormSchema = EditProfileValidationSchema;
  const form = useForm<z.infer<typeof EditProfileFormSchema>>({
    resolver: zodResolver(EditProfileFormSchema),
    defaultValues: {
      fullName: authUser?.fullName ?? "",
      username: authUser?.username ?? "",
      bio: authUser?.bio ?? "",
    },
  });

  async function onSubmit(userData: z.infer<typeof EditProfileFormSchema>) {
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

  return (
    <EditProfilePanel
      isDesktop={isDesktop}
      open={isOpen}
      setOpen={onOpenChange}
    >
      {/* form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`space-y-6 px-4 md:px-0`}
        >
          <div className="space-y-2">
            <div className="grid grid-cols-2 place-items-center gap-6">
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={selectedFile || authUser?.profilePicUrl}
                  className="h-full w-full object-cover"
                />
                <AvatarFallback>
                  {selectedFile || authUser?.profilePicUrl ? (
                    <Skeleton className="aspect-square h-full w-full rounded-full" />
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
                    | React.TouchEvent<HTMLButtonElement>,
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
            <FormMessage>{selectedFileError && selectedFileError}</FormMessage>
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

          {isDesktop ? (
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
          ) : (
            <DrawerFooter className="px-0">
              <Button
                type="submit"
                variant={"default"}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && <ButtonLoader />}
                Submit
              </Button>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => onClose()}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
            </DrawerFooter>
          )}
        </form>
      </Form>
      {/* end form */}
    </EditProfilePanel>
  );
};

const EditProfilePanel = ({
  isDesktop,
  open,
  setOpen,
  children,
}: {
  isDesktop: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}) => {
  const title = "Edit Profile";
  const description = "Update your public profile details";
  return isDesktop ? (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {children && children}
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children && children}
      </DrawerContent>
    </Drawer>
  );
};

export { EditProfile };
