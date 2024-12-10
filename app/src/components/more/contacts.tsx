import { useEffect, useState } from "react";
import UserSVG from "../../atoms/svg-comps/user-icon";
import { fetchData } from "../../helper/fetchData";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "../ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { CopySVG } from "../../atoms/svg-comps/copy";
import { DeleteSVG } from "../../atoms/svg-comps/delete";
import EditSVG from "../../atoms/svg-comps/edit";
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
} from "../ui/alert-dialog";
import { copyToClipboard } from "../../lib/utils";
import { BASE_URL } from "../../lib/config";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const ContactPage = () => {
	const [mode, setMode] = useState("add" as "add" | "edit" | "delete");
	const [editContactDetails, setEditContactDetails] = useState({} as any);
	const [deleteContactDetails, setDeleteContactDetails] = useState({} as any);
	const [contacts, setContacts] = useState([] as any[]);
	const [addContactPending, setAddContactPending] = useState(false);
	const [showDialog, setShowDialog] = useState(false);
	useEffect(() => {
		fetchData(`${BASE_URL}/contact`).then((data) => {
			setContacts(data);
		});
	}, []);
	const FormSchema = z.object({
		name: z.string().min(2, {
			message: "Name must be at least 2 characters.",
		}),
		address: z.string().regex(/^(0x)?[0-9a-f]{40}$/i, {
			message: "Invalid Address",
		}),
		description: z
			.string()
			.min(5, {
				message: "Description must be at least 2 characters.",
			})
			.max(25, {
				message: "Description must be at most 100 characters.",
			}),
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: "",
			address: "",
			description: "",
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		setAddContactPending(true);
		if (mode === "add") {
			fetchData(`${BASE_URL}/contact`, "POST", data)
				.then((data) => {
					const newContacts: any[] = [data, ...contacts];
					setContacts(newContacts as any);
					setAddContactPending(false);
					setShowDialog(false);
					toast("Contact Added Successfully", {
						description:
							"Contact has been added successfully to your directory.",
					});
				})
				.catch((error) => {
					const message =
						error?.message || "An error occurred while adding the contact.";
					setAddContactPending(false);
					toast("Error", {
						description: message,
						className: "!bg-red-700",
					});
				});
		} else if (mode === "edit") {
			fetchData(`${BASE_URL}/contact/${editContactDetails._id}`, "PATCH", data)
				.then((data) => {
					const newContacts = contacts.map((contact) => {
						if (contact._id === editContactDetails._id) {
							return data;
						}
						return contact;
					});
					setContacts(newContacts);
					setAddContactPending(false);
					setShowDialog(false);
					toast("Contact Updated Successfully", {
						description:
							"Contact has been updated successfully in your directory.",
					});
				})
				.catch((error) => {
					const message =
						error?.message || "An error occurred while updating the contact.";
					setAddContactPending(false);
					toast("Error", {
						description: message,
						className: "!bg-red-700",
					});
				});
		}
	}

	function editContact(contact: any) {
		setEditContactDetails(contact);
		form.setValue("name", contact.name);
		form.setValue("address", contact.address);
		form.setValue("description", contact.description);
		setMode("edit");
		setShowDialog(true);
	}

	function deleteContact() {
		setMode("delete");
		fetchData(`${BASE_URL}/contact/${deleteContactDetails._id}`, "DELETE")
			.then(() => {
				const newContacts = contacts.filter(
					(contact) => contact._id !== deleteContactDetails._id
				);
				setContacts(newContacts);
				setShowDialog(false);
				toast("Contact Deleted Successfully", {
					description:
						"Contact has been deleted successfully from your directory.",
				});
			})
			.catch((error) => {
				const message =
					error?.message || "An error occurred while deleting the contact.";
				toast("Error", {
					description: message,
					className: "!bg-red-700",
				});
			});
	}

	return (
		<section className="h-[calc(100vh-130px)] w-full">
			<div className="m-[6px] border border-[#232323] rounded-[8px] h-full pt-[16px] pb-[40px] px-[40px] overflow-y-auto hideScrollbar rounded-tr-none mr-0">
				<div className="flex items-center justify-between">
					<div className="flex justify-start items-center gap-x-8">
						<Link to="/more">
							<Button variant="outline" className="!min-w-10 w-10 h-10 !p-1">
								<svg
									className="rotate-180"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
								>
									<path
										fill="currentColor"
										d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6z"
									/>
								</svg>
							</Button>
						</Link>

						<h4 className="text-header !mt-0">Contacts</h4>
					</div>
					<Dialog
						onOpenChange={(val) => {
							if (!val) form.reset();
							setShowDialog(val);
						}}
						open={showDialog}
					>
						<DialogTrigger asChild>
							<button
								onClick={() => setMode("add")}
								className="h-[50px] w-[150px] bg-transparent rounded-[5px] flex-center gap-x-[10px]"
								style={{
									background:
										"linear-gradient(106deg, #5bb8da 4%, #9773d2 74%)",
								}}
							>
								<span className="text-base font-medium">Add Contact</span>
							</button>
						</DialogTrigger>
						<DialogContent className="!block py-4">
							<DialogHeader>
								<span className="text-sm font-semibold text-white text-center inline-block my-[10px]">
									{`${mode === "add" ? "Add New" : "Edit"} Contact`}
								</span>
							</DialogHeader>
							<div className="pt-[8px] w-full relative z-30 block select-none">
								<div className="w-full pb-[10px] rounded-[8px] text-center overflow-y-auto">
									<Form {...form}>
										<form
											onSubmit={form.handleSubmit(onSubmit)}
											className="w-2/3 space-y-6 m-auto"
										>
											<FormField
												control={form.control}
												name="name"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-[#FFFFFF]/60 text-[#FFFFFF]/60 text-left w-full text-xs font-medium text-xs font-medium">
															Name
														</FormLabel>
														<FormControl>
															<Input
																className="h-[45px] rounded-[5px] p-4 border border-border"
																placeholder="Enter Name"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="address"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-[#FFFFFF]/60 text-left w-full text-xs font-medium">
															Address
														</FormLabel>
														<FormControl>
															<Input
																className="h-[45px] rounded-[5px] p-4 border border-border"
																placeholder="Enter Address"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="description"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-[#FFFFFF]/60 text-left w-full text-xs font-medium">
															Description
														</FormLabel>
														<FormControl>
															<Input
																className="h-[45px] rounded-[5px] p-4 border border-border"
																placeholder="Enter Description"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<button
												disabled={addContactPending}
												className="h-[50px] !mt-6 mx-auto w-[150px] bg-transparent rounded-[5px] disabled:opacity-60 flex-center gap-x-[10px]"
												style={{
													background:
														"linear-gradient(106deg, #5bb8da 4%, #9773d2 74%)",
												}}
												type="submit"
											>
												{addContactPending ? "Saving..." : "Save Changes"}
											</button>
										</form>
									</Form>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>

				<div className="h-[70vh] table-bg rounded-[20px] overflow-y-auto hideScrollbar mt-[20px]">
					<div className="grid grid-cols-3 pt-[30px] pb-[20px] px-[40px] border-b border-border/80">
						<div className="shrink-0 justify-self-start gap-x-[10px] flex-center">
							Contacts List{" "}
							<span
								className="w-[35px] cursor-pointer flex-center h-[21px] rounded-[5px]"
								style={{
									background:
										"linear-gradient(106deg, #5bb8da 4%, #9773d2 74%)",
								}}
							>
								{contacts.length < 10 ? `0${contacts.length}` : contacts.length}
							</span>
						</div>
						<span className="justify-self-center">Address</span>
						<span className="justify-self-end mr-28">Description</span>
					</div>
					<ul>
						{contacts && contacts.length ? (
							contacts.map((contact: any, index) => (
								<li
									key={index}
									className="px-[40px] grid grid-cols-3 h-[60px] hover:shade"
								>
									<div className="flex justify-start justify-self-start items-center gap-x-[10px]">
										<UserSVG className="w-[20px]" />
										<div className="flex flex-col items-start gap-y-[4px] ml-[30px]">
											<span className="text-sm font-medium">
												{contact?.name ?? ""}
											</span>
										</div>
									</div>
									<div className="flex justify-center items-center gap-x-2 text-[#a7a7a7] text-sm font-medium">
										{contact?.address
											? `${contact?.address.slice(
													0,
													4
											  )}...${contact?.address.slice(-4)} `
											: "~"}
										<CopySVG
											className="text-[#493844] cursor-pointer active:scale-90"
											onClick={() => copyToClipboard(contact?.address)}
										/>
									</div>
									<div className="flex justify-end items-center justify-self-end text-sm font-normal text-right gap-x-2">
										{`${
											contact?.description?.length ? contact?.description : "~"
										}`}
										<button
											onClick={() => editContact(contact)}
											className="ml-12 h-[30px] p-2 text-white w-[30px] rounded-[5px] active:scale-105 hover:bg-[#53297c3b] bg-transparent flex-center gap-x-[10px]"
										>
											<EditSVG />
										</button>

										<AlertDialog>
											<AlertDialogTrigger asChild>
												<button
													onClick={() => setDeleteContactDetails(contact)}
													className="h-[30px] text-red-700 w-[30px] rounded-[5px] active:scale-105 hover:bg-[#53297c3b] bg-transparent flex-center gap-x-[10px]"
												>
													<DeleteSVG />
												</button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Are you absolutely sure?
													</AlertDialogTitle>
													<AlertDialogDescription>
														This action cannot be undone. This will permanently
														delete the contact from your directory.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogAction
														onClick={() => deleteContact()}
														className="flex cursor-pointer justify-center !w-24 h-auto text-white flex-grow-0 ml-[25px] px-4 border border-transparent py-1 rounded-[5px] bg-transparent hover:bg-accent"
													>
														Delete
													</AlertDialogAction>
													<AlertDialogCancel className="flex cursor-pointer justify-center !w-24 h-auto hover:font-semibold flex-grow-0 ml-[25px] !min-w-fit !px-4 !py-1 rounded-[5px] border border-white ">
														Cancel
													</AlertDialogCancel>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</li>
							))
						) : (
							<p className="text-[#a7a7a7] text-base py-6 text-center">
								No Recent Send Transactions
							</p>
						)}
					</ul>
				</div>
				{/* <button className="mx-auto block mt-[16px]">See All</button> */}
			</div>
		</section>
	);
};

export default ContactPage;
