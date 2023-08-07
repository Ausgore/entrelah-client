import { useAnimation, motion } from "framer-motion";
import { useState, ReactNode } from "react";
import { IoIosArrowUp } from "react-icons/io";
interface Props {
	title: string;
	children: ReactNode;
}

export default function CollapsibleItem(props: Props) {
	const [isCollapsed, setIsCollapsed] = useState(true);
	const collapseControls = useAnimation();
	function handleCollapse() {
		setIsCollapsed(function () {
			if (isCollapsed) collapseControls.start({ display: "block" });
			else collapseControls.start({ display: "none" });
			return !isCollapsed;
		})
	}

	return (
		<li className="py-2 pl-5 grid">
			<div className="flex justify-between">
				<span className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={handleCollapse}> {props.title} </span>
				<button className={`mr-5 text-gray-500 ${!isCollapsed && "rotate-180"}`}> <IoIosArrowUp /> </button>
			</div>
			<motion.ul initial={{ display: "none" }} animate={collapseControls}>
				{props.children}
			</motion.ul>
		</li>
	);
}