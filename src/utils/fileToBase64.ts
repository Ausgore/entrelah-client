export function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = (event) => resolve((event?.target?.result as string).split(',')[1]);
		reader.readAsDataURL(file);
	});
}