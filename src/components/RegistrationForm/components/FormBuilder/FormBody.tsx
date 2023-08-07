import { FormHTMLAttributes } from "react";


export default function FormBody(props: FormHTMLAttributes<HTMLFormElement>) {
	return (
		<form className={`bg-white shadow-lg rounded px-8 pt-2 pb-4 ${props.className}`} onSubmit={props.onSubmit}>
			{props.children}
		</form>
	)
}