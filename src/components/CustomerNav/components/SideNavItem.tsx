import { ReactNode, HTMLAttributes } from 'react';
import { Link } from "react-router-dom";

interface Props extends HTMLAttributes<HTMLElement> {
	to: string;
	children: ReactNode;
}

export default function SideNavItem(props: Props) {
	return (
		<li className={`py-2 px-5 text-gray-500 hover:text-gray-700 font-normal ${props.className}`}>
			<Link to={props.to}>
				{props.children}
			</Link>
		</li>
	);
}