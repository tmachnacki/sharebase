import { useState } from "react";
import { useCreatePost } from "@/hooks/useCreatePost";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import { FormItemPrimitive, FormDescriptionPrimitive, FormLabelPrimitive, FormMessagePrimitive } from "@/components/ui/form";

import { PlusSquare } from "lucide-react";
import { Input } from "../ui/input";
import { ButtonLoader } from "./button-loader";


type CreatePostProps = {
  triggerClassName?: string;
}

type CreatePostFields = {
  selectedFile: string | ArrayBuffer | null;
  caption: string;
  tags: string[];
  location: string;
}

const initialFieldState: CreatePostFields = {
  selectedFile: null,
  caption: "",
  tags: [],
  location: ""
}

const intialFieldErrorsState = {
  selectedFile: "",
  caption: "",
  tags: "",
  location: ""
}

// const hasError = (fieldError: string) => fieldError.length > 0

const CreatePost = ({ triggerClassName }: CreatePostProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields] = useState<CreatePostFields>(initialFieldState);
  const [fieldErrors, setFieldErrors] = useState(intialFieldErrorsState);

  const { isPending, handleCreatePost } = useCreatePost();

  const isDesktop = useMediaQuery("(min-width: 768px)");


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(fields)
  }

  return (
    <CreatePostPanel open={isOpen} setOpen={setIsOpen} isDesktop={isDesktop} >
      <form className="space-y-4 px-4 md:px-0" onSubmit={handleSubmit}>
        <FormItemPrimitive>
          <FormLabelPrimitive formItemId="caption" error={fieldErrors.caption ? true : false}>
            Caption
          </FormLabelPrimitive>
          <Input
            type="text"
            name="caption"
            id="caption"
            value={fields.caption}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.preventDefault();
              setFields((prevFields) => ({
                ...prevFields,
                caption: e.target.value
              }))
            }}
          />
          <FormMessagePrimitive error={fieldErrors.caption} />
        </FormItemPrimitive>

        <FormItemPrimitive>
          <FormLabelPrimitive formItemId="location" error={fieldErrors.location ? true : false}>
            Location
          </FormLabelPrimitive>
          <Input
            type="text"
            name="location"
            id="location"
            value={fields.location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.preventDefault();
              setFields((prevFields) => ({
                ...prevFields,
                location: e.target.value
              }))
            }}
          />
          <FormMessagePrimitive error={fieldErrors.location} />
        </FormItemPrimitive>

        {isDesktop ? (
          <DialogFooter >
            <DialogClose asChild>
              <Button type="button" variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant={"default"} disabled={isPending}>
              {isPending && <ButtonLoader/>}
              Submit
            </Button>
          </DialogFooter>
        ) : (
          <DrawerFooter className="px-0 ">
            <Button type="submit" variant={"default"} disabled={isPending}>
              {isPending && <ButtonLoader/>}
              Submit
            </Button>
            <Button type="button" variant={"outline"} onClick={() => setIsOpen(false)}>Cancel</Button>
          </DrawerFooter>
        )}
      </form>
    </CreatePostPanel>
  )
}

const CreatePostPanel = ({ isDesktop, open, setOpen, children }: { isDesktop: boolean; open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; children?: React.ReactNode }) => {
  return (
    isDesktop ? (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="primary-shadow">
            <PlusSquare className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Post</DialogTitle>
            <DialogDescription>
              Let's share something new.
            </DialogDescription>
          </DialogHeader>
          {children && children}
        </DialogContent>
      </Dialog>
    ) : (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="primary-shadow">
            <PlusSquare className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>New Post</DrawerTitle>
            <DrawerDescription>
              Let's share something new.
            </DrawerDescription>
          </DrawerHeader>
          {children && children}
        </DrawerContent>
      </Drawer>
    )
  )
}

export { CreatePost };