import { HTMLAttributes } from "react";

export default function FormHeader(props: HTMLAttributes<HTMLHeadingElement>) {
	return <h1 className="text-center py-6 text-gray-700 text-2xl font-bold"> {props.children} </h1>
}