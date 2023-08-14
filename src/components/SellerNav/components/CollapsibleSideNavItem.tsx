import { useState, ReactNode } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface CollapsibleSideNavItemProps {
	title: string;
	children: ReactNode;
}

export function CollapsibleSideNavItem(props: CollapsibleSideNavItemProps) {
	const [isCollapsed, setIsCollapsed] = useState(true);
	const handleCollapse = () => setIsCollapsed(!isCollapsed);

	return (
		<>
			<li>
				<header className="px-6 py-2 flex justify-between items-center cursor-pointer text-gray-600 text-[1.08rem]" onClick={handleCollapse}>
					<div className="font-semibold"> {props.title} </div>
					<FaChevronDown className="text-gray-500" size={14} />
				</header>
				{!isCollapsed && <ul> {props.children} </ul>}
			</li>
			<hr className="my-4" />
		</>
	);
}
