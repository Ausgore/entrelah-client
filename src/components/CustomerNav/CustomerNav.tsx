import { AiOutlineSearch } from "react-icons/ai";
import { PiGearLight } from "react-icons/pi";
import { MdOutlineLogout } from "react-icons/md";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser, useUserUpdate } from "@contexts/UserContext";
import api from "@api";
import CollapsibleNavItem from "./components/CollapsibleNavItem";
import SideNavItem from "./components/SideNavItem";
import NavCategory from "./components/NavCategory";
import MainNavItem from "./components/MainNavItem";

export default function MainNavigation() {
	const user = useUser();
	const [categories, setCategories] = useState<any[]>([]);
	const [subcategories, setSubcategories] = useState<any[]>([]);

	// Api-related stuff
	useEffect(function () {
		api.get("category").then(response => setCategories(response.data));
		api.get("subcategory").then(response => setSubcategories(response.data));
	}, []);
	// Api-related stuff

	// User Options
	const [userOptionsVisible, setUserOptionsVisible] = useState(false);
	const handleUserOptionsVisible = () => setUserOptionsVisible(!userOptionsVisible);
	const closeUserOptions = () => setUserOptionsVisible(false);
	const userOptionsRef = useRef<HTMLDivElement>(null);
	useEffect(function () {
		function handleOutsideClick(event: globalThis.MouseEvent) {
			if (userOptionsRef.current && event.target instanceof Node && userOptionsRef.current.contains(event.target)) return;
			closeUserOptions();
		}
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);
	// User Options

	// Sidebar
	const [sidebarVisible, setSidebarVisible] = useState(false);
	const handleSidebarVisible = () => setSidebarVisible(!sidebarVisible);
	const closeSidebarVisible = () => setSidebarVisible(false);
	const sidebarRef = useRef<HTMLElement>(null);
	useEffect(function () {
		function handleOutsideClick(event: globalThis.MouseEvent) {
			if (sidebarRef.current && event.target instanceof Node && sidebarRef.current.contains(event.target)) return;
			closeSidebarVisible();
		}
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);
	// Sidebar

	// Logout
	const updateUser = useUserUpdate();
	function handleLogout() {
		updateUser(null);
		window.location.reload();
	}

	return (
		<>
			{/* Sidebar Mobile */}
			{sidebarVisible && (
				<>
					{/* Sidebar */}
					<nav className="fixed lg:hidden h-full bg-white shadow-2xl z-[11] w-72 overflow-auto py-4" ref={sidebarRef}>
						{/* Header */}
						<header className="flex mx-5 mb-4">
							{/* User */}
							{user && <>
								<img src="/placeholder.webp" className=" w-16 rounded-full object-cover cursor-pointer border border-grey-500" alt="avatar" />
								<div className="ml-4">
									<Link to="/" className="mt-auto font-bold text-gray-800"> {user?.username} </Link>
									<div className="border-red-500 text-red-500 font-semibold"> {user?.currency} {user?.wallet} </div>
								</div>
							</>}
							{/* Non-user join button */}
							{!user && <button className="bg-red-500 p-2 rounded-md text-white font-semibold">
								Join Entrelah
							</button>}
						</header>
						{/* Links */}
						<ul>
							{user && <>
								<SideNavItem to="/"> Home </SideNavItem>
								<SideNavItem to="/"> Dashboard </SideNavItem>
								<CollapsibleNavItem title="Browse categories">
									{categories.map(category => (
										<CollapsibleNavItem title={category.name} key={category.id}>
											{subcategories.filter(s => s.categoryId == category.id).map(s => <SideNavItem to="/" key={s.id}> {s.name} </SideNavItem>)}
										</CollapsibleNavItem>
									))}
								</CollapsibleNavItem>
								<NavCategory> Buying </NavCategory>
								<SideNavItem to="/"> Post a Request </SideNavItem>
								<NavCategory> Selling </NavCategory>
								<SideNavItem to="/"> Start Selling </SideNavItem>
								<NavCategory> General </NavCategory>
								<SideNavItem to="/"> Settings </SideNavItem>
								<SideNavItem to="/"> Logout </SideNavItem>
							</>}
							{!user && <>
								<SideNavItem to="/"> Sign In </SideNavItem>
								<CollapsibleNavItem title="Browse categories">
									{categories.map(category => (
										<CollapsibleNavItem title={category.name}>
											{subcategories.filter(s => s.categoryId == category.id).map(s => <SideNavItem to="/" key={s.id}> {s.name} </SideNavItem>)}
										</CollapsibleNavItem>
									))}
								</CollapsibleNavItem>
								<NavCategory> General </NavCategory>
								<SideNavItem to="/"> Home </SideNavItem>
							</>}
						</ul>
					</nav>
					{/* Making everything else in the background darker */}
					<div className="fixed lg:hidden w-full h-full bg-black opacity-50 z-10" />
				</>
			)}
			{/* Mainbar */}
			<nav className="fixed bg-white w-full shadow-md px-6 h-28 z-[9]">
				{/* Title, Search, Account */}
				<div className="m-auto lg:flex lg:container py-2 my-2 align-middle items-center">
					{/* Title */}
					<div className="flex px-2 lg:px-0">
						{/* Hamburger, only visible on mobile */}
						<button className="lg:hidden" onClick={handleSidebarVisible}> <HiOutlineMenuAlt2 color="rgb(239,68,68)" size={24} /> </button>
						<Link to="/" className="text-2xl lg:text-3xl font-bold leading-none text-red-500 w-full text-center lg:w-auto lg:text-left"> Entrelah </Link>
					</div>
					{/* Search */}
					<div className="mx-2 lg:ml-6 flex mt-3 lg:mt-0 align-middle justify-center">
						{/* Input */}
						<input className="border-t-2 border-l-2 border-r-2 lg:border-r-0 border-b-2 p-1 px-4 rounded-l-sm border-gray-300 w-full lg:w-96" placeholder="Find Services" />
						<button className="bg-red-500 w-9 hidden items-center justify-center rounded-r-sm text-white lg:flex"> <AiOutlineSearch size={20} /> </button>
					</div>
					{/* Right nav */}
					<div className="ml-auto items-center hidden lg:flex">
						{user && <>
							{/* Switch to Seller */}
							<Link to="/" className="ml-8 font-semibold text-red-500 tracking-wide"> Switch to Selling </Link>
							{/* Profile Picture, should be clickable */}
							<div ref={userOptionsRef} className="relative">
								<img src="/placeholder.webp" className="ml-6 w-10 h-10 rounded-full object-cover cursor-pointer border border-grey-500" alt="avatar" onClick={handleUserOptionsVisible} />
								{/* User options */}
								{userOptionsVisible && (
									<div className="absolute right-0 mt-2 shadow-md bg-white border">
										{/* Profile */}
										<div className="py-3 px-4">
											<h1> {user?.username} </h1>
											<h2 className="text-gray-600"> {user?.email} </h2>
										</div>
										<hr />
										{/* Redirects */}
										<Link to={`/users/${user?.username}`} className="flex items-center text-gray-600 p-2 pl-4 hover:bg-gray-100"> <PiGearLight className="mr-2" /> Profile </Link>
										<a onClick={handleLogout} className="flex items-center text-gray-600 p-2 pl-4 hover:bg-gray-100 cursor-pointer"> <MdOutlineLogout className="mr-2" /> Logout </a>
									</div>
								)}
							</div>
							{/* Balance */}
							<Link to="/" className="ml-6 border rounded-md border-red-500 text-red-500 font-semibold px-1"> {user?.currency} {user?.wallet} </Link>
						</>}
						{!user && <>
							{/* Switch to Seller */}
							<Link to="/" className="ml-6 font-semibold text-gray-600 hover:text-red-500"> Become a Seller </Link>
							<Link to="/" className="ml-6 font-semibold text-gray-600 hover:text-red-500"> Sign In </Link>
							<Link to="/" className="ml-6 font-semibold border text-red-500 p-[0.1rem] px-4 border-red-500 rounded-md hover:bg-red-500 hover:text-white"> Join </Link>
						</>}
					</div>
				</div>
				<hr className="hidden lg:block" />
				{/* Categories */}
				<ul className="m-auto hidden lg:flex container pt-2 justify-between font-semibold text-gray-600 text-sm xl:text-base">
					{categories.map(category => <MainNavItem title={category.name} key={category.id}>
						{subcategories.filter(s => s.categoryId == category.id).map(s => <SideNavItem className="hover:bg-gray-100 hover:text-current cursor-pointer" to="/" key={s.id}> {s.name} </SideNavItem>)}
					</MainNavItem>)}
				</ul>
			</nav>
		</>
	);
}	