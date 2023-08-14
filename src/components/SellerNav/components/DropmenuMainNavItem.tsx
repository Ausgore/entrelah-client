import { useRef, useState, useEffect, ReactNode } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface DropmenuMainNavItemProps {
	title: string;
	children: ReactNode;
}

export function DropmenuMainNavItem(props: DropmenuMainNavItemProps) {
	const [isDropmenuVisible, setIsDropmenuVisible] = useState(false);
	const handleDropmenuVisible = () => setIsDropmenuVisible(!isDropmenuVisible);
	const closeDropmenu = () => setIsDropmenuVisible(false);
	const dropmenuRef = useRef<HTMLLIElement>(null);
	useEffect(function () {
		function handleOutsideClick(event: globalThis.MouseEvent) {
			if (dropmenuRef.current && event.target instanceof Node && dropmenuRef.current.contains(event.target)) return;
			closeDropmenu();
		}
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);	

	return (
		<li className="relative" ref={dropmenuRef}>
			<header className="py-2 px-4 hover:bg-gray-100 rounded-md flex items-center cursor-pointer" onClick={handleDropmenuVisible}>
				<div className="mr-6 font-semibold"> {props.title} </div>
				<FaChevronDown className="text-gray-500" size={14} />
			</header>
			{isDropmenuVisible && <ul className="absolute bg-white border rounded-md py-2 mt-2 shadow-md w-56"> {props.children} </ul>}
		</li>
	);
}
