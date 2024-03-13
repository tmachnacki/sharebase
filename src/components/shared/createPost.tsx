import { SetStateAction, useRef, useState } from "react";
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
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
import { useForm } from "react-hook-form";

import { PlusSquare } from "lucide-react";
import { Input } from "../ui/input";
import { ButtonLoader } from "./button-loader";

import { CreatePostValidationSchema } from "@/lib/validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePreviewImage } from "@/hooks/usePreviewImage";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { PostDocument } from "@/types";
import { DocumentData } from "firebase/firestore";

type CreatePostProps = {
	open: boolean;
	setOpen: React.Dispatch<SetStateAction<boolean>>;
	isDesktop: boolean;
	action?: "create" | "edit";
	post?: PostDocument | DocumentData;
};

const CreatePost = ({ open, setOpen, isDesktop, action = "create", post }: CreatePostProps) => {
	const fileRef = useRef<HTMLInputElement>(null);
	const {
		selectedFile,
		setSelectedFile,
		selectedFileError,
		setSelectedFileError,
		handleImageChange,
	} = usePreviewImage();

	const { isPending, handleCreatePost, createPostError } = useCreatePost();
	// const isDesktop = useMediaQuery("(min-width: 768px)");

	const initialFormFields = action === "create" 
		? {
			caption: "",
			location: "",
			tags: [],
		}
		: {
			caption: post?.caption ? post.caption : "",
			location: post?.location ? post.location : "",
			tags: post?.tags ? post.tags : []
		}

	const form = useForm<z.infer<typeof CreatePostValidationSchema>>({
		resolver: zodResolver(CreatePostValidationSchema),
		defaultValues: initialFormFields
	});

	const onSubmit = async (postData: z.infer<typeof CreatePostValidationSchema>) => {
		const { caption, tags, location } = postData;
		await handleCreatePost(caption, tags ?? [], location, "create")
		if (!createPostError) handleCloseDialog();
	};

	const handleCloseDialog = () => {
		setOpen(false);
		setTimeout(() => {
			form.reset();
			setSelectedFile(null);
		}, 0)
	}

	return (
		<CreatePostPanel open={open} setOpen={setOpen} isDesktop={isDesktop} handleOpenChange={handleCloseDialog}>
			<Form {...form}>
				<form
					className="px-4 space-y-6 md:px-0 "
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className="w-full space-y-2">
						<div className="grid w-full grid-cols-1 gap-4 place-items-center">
							<div
								className={`aspect-square rounded-lg w-full h-auto ${selectedFile ? "" : "border border-dashed "}`}
							>
								{selectedFile && (
									<img
										src={selectedFile?.toString()}
										className="object-cover w-full h-full rounded-lg"
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
										| React.TouchEvent<HTMLButtonElement>
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
					<FormField
						control={form.control}
						name="caption"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Caption</FormLabel>
								<FormControl>
									<Input type="text" {...field} />
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
									<Input type="text" {...field} />
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
									<Input type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{isDesktop ? (
						<DialogFooter>
							<Button type="button" variant={"outline"} onClick={handleCloseDialog}>
								Cancel
							</Button>
							<Button
								type="submit"
								variant={"default"}
								disabled={isPending}
							>
								{isPending && <ButtonLoader />}
								Submit
							</Button>
						</DialogFooter>
					) : (
						<DrawerFooter className="px-0 ">
							<Button
								type="submit"
								variant={"default"}
								disabled={isPending}
							>
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
}: {
	isDesktop: boolean;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleOpenChange: () => void;
	children?: React.ReactNode;
}) => {
	const title = "New Post";
	const description = "Let's share something new";
	return isDesktop ? (
		<Dialog open={open} onOpenChange={open ? handleOpenChange : setOpen}>
			<DialogContent className="sm:max-w-md ">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				{children && children}
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open={open} onOpenChange={setOpen} onClose={handleOpenChange}  >
			<DrawerContent className="">
				<ScrollArea>
					<DrawerHeader className="text-left">
						<DrawerTitle>{title}</DrawerTitle>
						<DrawerDescription>{description}</DrawerDescription>
					</DrawerHeader>
					{children && children}
				</ScrollArea>
			</DrawerContent>
		</Drawer >
	);
};

export { CreatePost };
