import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	errors?: { [key: string]: string }
}
export default function FormInput(props: InputProps) {
	return (
		<div className={props.className}>
			<input name={props.name} className="leading-tight border-2 rounded py-2 px-3 text-gray-700 w-80 focus:outline-none focus:border-slate-300 hover:broder-slate-300" placeholder={props.placeholder} />
			{props.errors && <div className="mt-1 w-80 text-red-500 text-sm"> {props.errors[props.name as string]} </div>}
		</div>
	);
}
