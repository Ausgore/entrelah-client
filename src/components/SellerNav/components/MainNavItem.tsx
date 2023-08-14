import { Link, LinkProps } from "react-router-dom";

export function MainNavItem(props: LinkProps) {
	return <Link to={props.to}> <li className={`px-4 py-2 hover:bg-gray-100 text-gray-600 text-[1.08rem] ${props.className}`}> {props.children} </li> </Link>;
}