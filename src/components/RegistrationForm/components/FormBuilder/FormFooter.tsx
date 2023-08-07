import { HTMLAttributes } from "react";

export default function FormFooter(props: HTMLAttributes<HTMLElement>) {
	return (
		<footer className={`text-center ${props.className}`}>
			<hr className="mb-4" />
			{props.children}
		</footer>
	);
}