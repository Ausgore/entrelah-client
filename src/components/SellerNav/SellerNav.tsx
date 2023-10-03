import { useUser, useUserUpdate } from "@contexts/UserContext";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { FiMail } from "react-icons/fi";
import { FaRegBell } from "react-icons/fa";
import { SideNavItem } from "./components/SideNavItem";
import { MainNavItem } from "./components/MainNavItem";
import { DropmenuMainNavItem } from "./components/DropmenuMainNavItem";
import { CollapsibleSideNavItem } from "./components/CollapsibleSideNavItem";
import { Buffer } from "buffer";

export function SellerNav() {
	const user = useUser();
	const userUpdate = useUserUpdate();
	const navigate = useNavigate();

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
	});
	// Sidebar

	// User stuff
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
	// User stuff

	function handleLogout() {
		userUpdate(null);
		navigate("/");
	}

	return (
		<>
			{sidebarVisible && (
				<>
					{/* Sidebar */}
					<nav className="fixed xl:hidden h-full bg-white shadow-2xl z-[50] w-72 overflow-auto py-4" ref={sidebarRef}>
						{/* User information */}
						<div className="flex pt-2 mb-4 px-4 items-center">
							<img src="/placeholder.webp" className="rounded-full w-12" alt="avatar" />
							<div className="ml-4">
								<h1 className="font-semibold"> {user?.username} </h1>
								<h2 className="text-gray-600"> {user?.email} </h2>
							</div>
						</div>
						<hr />
						{/* Navigations */}
						<ul className="my-4">
							<SideNavItem to="/" className="font-semibold"> Dashboard </SideNavItem>
							<hr className="my-4" />
							<SideNavItem to="/inbox" className="md:hidden font-semibold"> Inbox </SideNavItem>
							<hr className="my-4 md:hidden" />
							<CollapsibleSideNavItem title="My Business">
								<SideNavItem to="/"> Orders </SideNavItem>
								<SideNavItem to={`/users/${user?.username}/manage_gigs?type=active`}> Gigs </SideNavItem>
								<SideNavItem to={`/users/${user?.username}`}> Profile </SideNavItem>
								<SideNavItem to="/"> Earnings </SideNavItem>
							</ CollapsibleSideNavItem>
							<CollapsibleSideNavItem title="Analytics">
								<SideNavItem to="/"> Overview </SideNavItem>
								<SideNavItem to="/"> Repeat Business </SideNavItem>
							</ CollapsibleSideNavItem>
							<CollapsibleSideNavItem title="Account">
								<SideNavItem to={`/users/${user?.username}`}> Profile </SideNavItem>
								<SideNavItem to="/"> Settings </SideNavItem>
							</ CollapsibleSideNavItem>
						</ul>
						<ul className="sm:hidden">
							<button className="px-6 py-2 hover:bg-gray-100 text-gray-600 text-[1.08rem] cursor-pointer w-full text-left" onClick={handleLogout}> Logout </button>
							<SideNavItem to="/"> Switch to buying </SideNavItem>
						</ul>
					</nav>
					{/* Opacity */}
					<div className="fixed xl:hidden w-full h-full bg-black opacity-50 z-[49]" />
				</>
			)}
			{/* Mainbar */}
			<nav className="fixed bg-white w-full shadow-md px-6 h-20 z-[49]">
				{/* Title, Navigations, Account */}
				<div className="flex container mx-auto h-full">
					<div className="flex px-2 items-center justify-between w-full">
						{/* Sidenav button */}
						<div className="flex items-center w-full sm:w-fit">
							<button className="xl:hidden sm:mr-8" onClick={handleSidebarVisible}> <HiOutlineMenuAlt2 color="rgb(239,68,68)" size={28} /> </button>
							{/* Title */}
							<Link to="/" className="flex flex-grow justify-center lg:flex-none mr-6 text-3xl font-bold text-red-500"> Entrelah </Link>
							{/* Navigations */}
							<ul className="gap-8 ml-6 text-gray-600 tracking-wide text-[1.03rem] hidden xl:flex">
								<MainNavItem to="/" className="rounded-md font-semibold"> Dashboard </MainNavItem>
								<DropmenuMainNavItem title="My Business">
									<MainNavItem to={`/users/${user?.username}/manage_orders?type=active`}> Orders </MainNavItem>
									<MainNavItem to={`/users/${user?.username}/manage_gigs?type=active`}> Gigs </MainNavItem>
									<MainNavItem to={`/users/${user?.username}`}> Profile </MainNavItem>
									<MainNavItem to="/"> Earnings </MainNavItem>
								</DropmenuMainNavItem>
								<DropmenuMainNavItem title="Analytics">
									<MainNavItem to="/"> Overview </MainNavItem>
									<MainNavItem to="/"> Repeat Business </MainNavItem>
								</DropmenuMainNavItem>
							</ul>
						</div>
						{/* Profile */}
						<div className="sm:flex items-center hidden">
							{/* Inbox and notification */}
							<ul className="hidden md:flex gap-5">
								<li className="p-2 hover:bg-gray-200 rounded-md cursor-pointer"> <FaRegBell size={22} className="text-gray-500" /> </li>
								<li className="p-2 hover:bg-gray-200 rounded-md cursor-pointer" onClick={() => navigate("/inbox")}> <FiMail size={22} className="text-gray-500" /> </li>
							</ul>
							{/* Profile picture */}
							<div className="relative ml-8" ref={userOptionsRef}>
								<img src={user?.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(user.avatar.data).buffer)], user.avatar.filename, { type: user.avatar.contentType })) : "/placeholder.webp"}className="rounded-full w-9 h-9 cursor-pointer" alt="avatar" onClick={handleUserOptionsVisible} />
								{/* Dropdown */}
								{userOptionsVisible && (
									<div className="absolute w-max right-0 bg-white border shadow-md mt-3 rounded-md py-2">
										{/* User information */}
										<div className="flex pt-2 mb-4 px-4 items-center">
											<img src={user?.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(user.avatar.data).buffer)], user.avatar.filename, { type: user.avatar.contentType })) : "/placeholder.webp"} className="rounded-full w-12 h-12" alt="avatar" />
											<div className="ml-4">
												<h1 className="font-semibold"> {user?.username} </h1>
												<h2 className="text-gray-600"> {user?.email} </h2>
											</div>
										</div>
										<hr />
										{/* Profile options */}
										<ul className="my-2 text-gray-700">
											<Link to={`/users/${user?.username}`}> <li className="px-4 py-2 hover:bg-gray-100"> Profile </li> </Link>
											<Link to={`/users/${user?.username}`}> <li className="px-4 py-2 hover:bg-gray-100"> Settings </li> </Link>
										</ul>
										<hr />
										<button className="mt-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left" onClick={handleLogout}> Logout </button>
									</div>
								)}
							</div>
							<Link to="/" className="ml-8 border rounded-md border-black font-semibold px-1"> {user?.currency} {user?.wallet} </Link>
						</div>
					</div>
				</div>
			</nav>
		</>
	)
}