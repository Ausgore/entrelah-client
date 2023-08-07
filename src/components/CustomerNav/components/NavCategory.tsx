import { ReactNode } from 'react';
interface Props {
	children: ReactNode;
}

export default function NavCategory(props: Props) {
	return (
		<>
			<li className="pb-2 pt-4 px-5 text-sm font-bold text-gray-500"> {props.children} </li>
			<hr className="mt-2" />
		</>
	);
}