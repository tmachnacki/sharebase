import { SetStateAction, useEffect, useRef } from "react";
import { useCreatePost } from "@/hooks/useCreatePost";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

import { Input } from "../ui/input";
import { ButtonLoader } from "./button-loader";

import { CreatePostValidationSchema } from "@/lib/validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePreviewImage } from "@/hooks/usePreviewImage";
import { PostDocument } from "@/types";
import { DocumentData } from "firebase/firestore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useGetOtherUsers } from "@/hooks/useGetOtherUsers";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MultiSelect } from "../ui/multi-select";
import { useAuthStore } from "@/store/authStore";

type CreatePostProps = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  action?: "create" | "edit";
  post?: PostDocument | DocumentData;
};

const CreatePost = ({
  open,
  setOpen,
  action = "create",
  post,
}: CreatePostProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const {
    selectedFile,
    setSelectedFile,
    selectedFileError,
    handleImageChange,
  } = usePreviewImage();

  const { isPending, handleCreatePost, createPostError } = useCreatePost();
  const { isLoadingUsers, getOtherUsers, users } = useGetOtherUsers();
  const authUser = useAuthStore((state) => state.user);

  const tagUserOptions: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[] = users.map((user) => {
    return {
      label: user.fullName,
      value: user.uid,
      icon: (
        <Avatar className="mr-2 h-6 w-6">
          <AvatarImage
            src={user.profilePicUrl}
            alt={`${user.fullName} profile picture`}
          ></AvatarImage>
          <AvatarFallback className=" text-xs">
            {getInitials(user.fullName)}
          </AvatarFallback>
        </Avatar>
      ),
    };
  });

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const initialFormFields =
    action === "create"
      ? {
          caption: "",
          location: "",
          tags: [],
        }
      : {
          caption: post?.caption ? post.caption : "",
          location: post?.location ? post.location : "",
          tags: post?.tags ? post.tags : [],
        };

  const form = useForm<z.infer<typeof CreatePostValidationSchema>>({
    resolver: zodResolver(CreatePostValidationSchema),
    defaultValues: initialFormFields,
  });

  const onSubmit = async (
    postData: z.infer<typeof CreatePostValidationSchema>,
  ) => {
    const { caption, tags, location } = postData;

    await handleCreatePost({
      caption: caption,
      tags: tags ? tags : [],
      location: location,
      selectedFile: selectedFile,
      action: action,
      post: post,
    });
    if (!createPostError) handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpen(false);
    form.reset();
    setSelectedFile(null);
  };

  useEffect(() => {
    if (authUser) getOtherUsers(authUser.uid);
  }, [authUser]);

  return (
    <CreatePostPanel
      open={open}
      setOpen={setOpen}
      isDesktop={isDesktop}
      handleOpenChange={handleCloseDialog}
      action={action}
    >
      <Form {...form}>
        <form
          className="space-y-6 overflow-y-auto px-4 md:overflow-visible md:px-0 "
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {action === "create" && (
            <div className="w-full space-y-2">
              <div className="grid w-full grid-cols-1 place-items-center gap-4">
                <div
                  className={`aspect-square h-auto w-full max-w-sm rounded-lg md:max-w-full ${selectedFile ? "" : "border border-dashed "}`}
                  onClick={
                    !selectedFile
                      ? () => fileRef?.current && fileRef?.current.click()
                      : () => null
                  }
                >
                  {selectedFile && (
                    <img
                      src={selectedFile?.toString()}
                      className="h-full w-full rounded-lg object-cover"
                      alt="post image"
                    />
                  )}
                </div>

                <Button
                  variant={"outline"}
                  className="w-full"
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
                  Choose Image
                </Button>

                <Input
                  className="hidden"
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </div>
              {selectedFileError && (
                <FormMessage>{selectedFileError}</FormMessage>
              )}
            </div>
          )}
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caption</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Tell us about your post"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <MultiSelect
                    defaultValue={action === "edit" ? post?.tags : []}
                    onValueChange={(value: string[]) =>
                      form.setValue("tags", value)
                    }
                    options={tagUserOptions}
                    optionsLoading={isLoadingUsers}
                    placeholder="Tag people"
                    {...field}
                  ></MultiSelect>
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
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button type="submit" variant={"default"} disabled={isPending}>
                {isPending && <ButtonLoader />}
                Submit
              </Button>
            </AlertDialogFooter>
          ) : (
            <DrawerFooter className="px-0 ">
              <Button type="submit" variant={"default"} disabled={isPending}>
                {isPending && <ButtonLoader />}
                Submit
              </Button>
              <Button
                type="button"
                variant={"outline"}
                onClick={handleCloseDialog}
                disabled={isPending}
              >
                Cancel
              </Button>
            </DrawerFooter>
          )}
        </form>
      </Form>
    </CreatePostPanel>
  );
};

const CreatePostPanel = ({
  isDesktop,
  open,
  setOpen,
  handleOpenChange,
  children,
  action,
}: {
  isDesktop: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenChange: () => void;
  children?: React.ReactNode;
  action: "edit" | "create";
}) => {
  const title = action === "create" ? "New Post" : "Edit Post";
  const description =
    action === "create"
      ? "Let's share something new"
      : "Let's update some details";
  return isDesktop ? (
    <AlertDialog open={open} onOpenChange={open ? handleOpenChange : setOpen}>
      <AlertDialogContent className="">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {children && children}
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <Drawer open={open} onClose={handleOpenChange} dismissible={false}>
      <DrawerContent className="">
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children && children}
      </DrawerContent>
    </Drawer>
  );
};

export { CreatePost };
