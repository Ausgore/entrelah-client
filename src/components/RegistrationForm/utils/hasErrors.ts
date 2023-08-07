export default function hasErrors(errors: { [key: string]: string }) {
	return Object.values(errors).every(v => v.length > 1);
}