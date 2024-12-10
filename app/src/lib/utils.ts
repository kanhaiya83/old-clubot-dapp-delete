import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const copyToClipboard = (text: number | string) => {
	// Create a temporary input element to hold the value
	const tempInput = document.createElement("input");
	tempInput.value = text.toString();
	document.body.appendChild(tempInput);

	// Select the text in the input element
	tempInput.select();
	tempInput.setSelectionRange(0, 99999); // For mobile devices

	// Copy the selected text to the clipboard
	document.execCommand("copy");

	// Remove the temporary input element
	document.body.removeChild(tempInput);
};
