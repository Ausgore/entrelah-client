import CustomerNav from "@components/CustomerNav/CustomerNav";
import { SellerNav } from "@components/SellerNav/SellerNav";
import { useUser } from "@contexts/UserContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Link as LinkScroll } from "react-scroll";
import { AiOutlineInfoCircle, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useState, useEffect, Fragment, useRef } from "react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import api from '@api';
import { Buffer } from "buffer";
import { LuClock3 } from "react-icons/lu";
import { TbRefresh } from "react-icons/tb";
import { BiHomeAlt, BiRightArrowAlt } from "react-icons/bi";
import commaNumber from "comma-number";
import { MdKeyboardArrowDown, MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp, MdOutlineClose } from "react-icons/md";
import ms from "ms";
import { FiPackage } from "react-icons/fi";
import { HiExclamationCircle } from "react-icons/hi";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";

export function Gig() {
	const navigate = useNavigate();
	const user = useUser();
	const { username, gigId } = useParams();

	const orderRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleOutsideClick = (e: globalThis.MouseEvent) => {
			const target = e.target as Node;
			if (orderRef.current && !orderRef.current.contains(target)) setOrderDropdown(false);
		}
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, [orderRef]);

	const [continueOverlay, setContinueOverlay] = useState(false);
	const handleContinueOverlay = () => {
		setContinueOverlay(!continueOverlay);
		if (!gig?.multipackages) setPackageIndex(0);
	}

	const [orderDropdown, setOrderDropdown] = useState(false);
	const [orderQuantity, setOrderQuantity] = useState(1);
	const [gigOwner, setGigOwner] = useState<any>(null);
	const [gig, setGig] = useState<any>(null);
	const [gigAttachments, setGigAttachments] = useState<any[]>([]);
	const [packageIndex, setPackageIndex] = useState(0);

	useEffect(() => {
		document.body.style.backgroundColor = "white";
		return () => {
			document.body.style.backgroundColor = "#f0f2f5";
		}
	}, []);

	useEffect(() => {
		api.get(`gig/${gigId}`).then(async res => {
			setGig(res.data);
			const { data } = await api.get(`gig/${gigId}/attachments`);
			setGigAttachments(data.sort((a: any, b: any) => {
				if (a.type != b.type) return a.type - b.type;
				else return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
			}));
		});
		api.get(`user?username=${username}`).then(async res => {
			const { data } = await api.get(`user/${res.data[0].id}`);
			setGigOwner(data);
		});
	}, [gigId]);

	const [priceInfoHovering, setPriceInfoHovering] = useState(false);

	const [faqUncollapsedIndex, setFaqUncollapsedIndex] = useState(-1);
	const handleFaqClick = (currentIndex: number) => {
		if (currentIndex == faqUncollapsedIndex) setFaqUncollapsedIndex(-1);
		else setFaqUncollapsedIndex(currentIndex);
	}

	const [errorDisplayed, setErrorDisplayed] = useState(false);
	const displayError = () => {
		setErrorDisplayed(true);
		setTimeout(() => setErrorDisplayed(false), 3000);
	}

	const handleContinueClick = () => {
		if (user?.id == gigOwner?.id) return displayError();
		navigate(`/payments/${gig?.packages[packageIndex].id}?tab=confirm&quantity=${orderQuantity}`);
	}

	return (
		<>
			{user?.username == username ? <SellerNav /> : <CustomerNav />}
			{continueOverlay && <>
				{/* Error */}
				{errorDisplayed && <div className="fixed z-50 w-full flex mt-3">
					<div className="mx-auto bg-white rounded-sm shadow-lg p-2 flex justify-between items-center px-4 border-l-4 border-l-red-500">
						<div className="flex items-center">
							<HiExclamationCircle className="text-red-500 mr-2" />
							<p className="font-semibold text-gray-700"> An error has occured. Please try again later. </p>
						</div>
						<MdOutlineClose className="ml-6 text-gray-700 cursor-pointer" onClick={() => setErrorDisplayed(false)} />
					</div>
				</div>}
				{/* Overlay */}
				<div className="fixed w-full h-full bg-black opacity-50 z-[49]" onClick={handleContinueOverlay} />
				{/* Continue menu */}
				<div className="fixed h-full right-0 z-50 flex flex-col">
					<div className="bg-white h-full shadow-lg w-[30rem] flex flex-col">
						{/* Header */}
						<section>
							<div className="flex justify-between items-center mx-4">
								<h1 className="text-gray-600 text-[1.06rem] font-semibold py-4 mx-4"> Order options </h1>
								<MdOutlineClose className="mr-4 text-gray-600 cursor-pointer" size={22} onClick={handleContinueOverlay} />
							</div>
							<hr className="border-gray-300" />
						</section>
						{/* Body */}
						<section className="my-8 mx-4">
							{/* Package details */}
							<article className="border-2 border-gray-900 mx-4 p-5 rounded-md">
								<h1 className="mb-2 flex justify-between items-center">
									<span className="font-semibold text-[1.1rem] text-gray-800"> {gig?.packages[packageIndex].title} </span>
									<span className="text-[0.98rem]"> {user?.currency} {commaNumber((gig?.packages[packageIndex].price * orderQuantity).toFixed(2))} </span>
								</h1>
								<p className="text-[0.9rem]"> {gig?.packages[packageIndex].description} </p>
								<hr className="border-gray-300 mt-5 mb-4" />
								<div className="flex justify-between items-center">
									<p className="text-[1.05rem]"> Gig Quantity </p>
									<div className="flex items-center">
										{/* Minus */}
										<div className="border border-gray-300 p-3 rounded-full hover:border-gray-500 cursor-pointer" onClick={() => setOrderQuantity(orderQuantity == 1 ? 1 : orderQuantity - 1)}>
											<AiOutlineMinus size={14} />
										</div>
										<span className="mx-4 text-[1.02rem]">{orderQuantity}</span>
										{/* Plus */}
										<div className="border border-gray-300 p-3 rounded-full hover:border-gray-500 cursor-pointer" onClick={() => setOrderQuantity(orderQuantity == 20 ? 20 : orderQuantity + 1)}>
											<AiOutlinePlus size={14} />
										</div>
									</div>
								</div>
							</article>
							<hr className="border-gray-200 mx-4 my-7" />
							{/* Total price */}
							<article className="bg-[#f3f3f3] mx-4 p-8 rounded-md mt-5">
								<h1 className="text-3xl font-bold text-[#393939] mb-2"> {user?.currency} {commaNumber((gig?.packages[packageIndex].price * orderQuantity).toFixed(2))} </h1>
								<h2 className="text-[0.9rem] font-semibold text-gray-700"> Single order (<span className="text-[0.8rem]">X</span>{orderQuantity}) </h2>
								<hr className="my-5 border-gray-300" />
								<div className="flex flex-col">
									{/* Packages */}
									<div className="flex items-center text-gray-900 mb-3">
										<FiPackage className="mr-3" size={16} />
										<div className="text-sm font-semibold"> {packageIndex == 0 ? "Basic" : packageIndex == 1 ? "Standard" : "Premium"} Package (<span className="text-[0.8rem]">X</span>{orderQuantity}) </div>
									</div>
									{/* Time */}
									<div className="flex items-center text-gray-900 mb-3">
										<LuClock3 className="mr-3" size={16} />
										<div className="text-sm font-semibold"> {gig?.packages[packageIndex].deliveryDays}-day delivery </div>
									</div>
									{/* Revisions */}
									<div className="flex items-center text-gray-900">
										<TbRefresh className="mr-3" size={16} />
										<div className="text-sm font-semibold">
											{gig?.packages[packageIndex].revisions == 0 ? "No" : gig?.packages[packageIndex].revisions == -1 ? "Unlimited" : gig?.packages[packageIndex].revisions} revision{gig?.packages[packageIndex].revisions > 1 || gig?.packages[packageIndex].revisions < 1 ? "s" : ""}
										</div>
									</div>
								</div>
							</article>
						</section>
						{/* Footer */}
						<footer className="flex flex-col justify-center text-center mt-auto mb-7">
							<hr className="border-gray-300" />
							<button className="bg-black hover:bg-[#404145] text-white font-semibold text-[1.05rem] tracking-tight py-3 rounded-md relative mt-6 px-6 mx-8 mb-1" onClick={handleContinueClick}>
								Continue ({gigOwner?.currency} {commaNumber((gig?.packages[packageIndex].price * orderQuantity).toFixed(2))})
							</button>
							<p className="text-[0.8rem] text-gray-800"> You won't be charged yet </p>
						</footer>
					</div>
				</div>
			</>}
			{/* Main page */}
			<div className={`mx-auto container pt-10 ${user?.username == username ? "pt-28" : "pt-36"}`}>
				<div className="flex justify-between sm:mx-12 mx-4 relative">
					{/* Left */}
					<div className="xl:mr-12">
						<div className="flex items-center mb-6">
							<Link to="/" className="hover:bg-gray-100 p-2 rounded-full"> <BiHomeAlt size={14} className="text-gray-800" /> </Link>
							<p className="text-gray-400 mx-3">/</p>
							<Link className="text-[0.9rem] text-gray-600 font-[600] hover:underline underline-offset-2" to={`/categories/${gig?.subcategory.category.name}`}>{gig?.subcategory.category.name}</Link>
							<p className="text-gray-400 mx-3">/</p>
							<Link className="text-[0.9rem] text-gray-600 font-[600] hover:underline underline-off-set-2" to={`/categories/${gig?.subcategory.category.name}/${gig?.subcategory.name}`}>{gig?.subcategory.name}</Link>
						</div>
						<header>
							{/* Gig Title */}
							<h1 className="text-3xl font-semibold text-gray-800 mb-4"> I will {gig?.title} </h1>
							{/* Gig Owner Information */}
							<div className="flex items-center">
								<img src={gigOwner?.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(gigOwner.avatar.data).buffer)], gigOwner.avatar.filename, { type: gigOwner.avatar.contentType })) : "/placeholder.webp"} alt="profile" className="h-16 w-16 rounded-full" />
								<div className="ml-3">
									<div className="mb-1">
										<LinkScroll smooth={true} offset={-100} to="seller" className="text-lg font-bold text-gray-700 hover:underline mr-3 cursor-pointer">{gigOwner?.displayName ?? "DisplayName"}</LinkScroll>
										<LinkScroll smooth={true} offset={-100} to="seller" className="text-gray-500 hover:underline cursor-pointer">@{gigOwner?.username}</LinkScroll>
									</div>
									<div className="flex">
										<TotalReviews reviews={gigOwner?.reviewsReceived.filter((r: any) => r.reviewType == "seller")} />
										{gig?.packages.reduce((a: number, p: any) => a + p.orders.length, 0) > 0 && <span className="border-l pl-3 ml-3 border-gray-300 text-gray-500 tracking-tight"> {gig?.packages.reduce((a: number, p: any) => a + p.orders.length, 0)} Order{gig?.packages.reduce((a: number, p: any) => a + p.orders.length, 0) > 1 ? "s" : ""} in Queue </span>}
									</div>
								</div>
							</div>
						</header>
						{/* Gig Attachments */}
						<div className="my-6 h-[24rem] lg:h-[34rem] w-[42rem] lg:w-[58rem]">
							<Swiper
								modules={[Navigation, Pagination]}
								navigation
								pagination={{ clickable: true }}
								scrollbar={{ draggable: true }}
								freeMode
								slidesPerView={1}
								className="h-full w-full">
								{gigAttachments.map(attachment => {
									const url = URL.createObjectURL(new File([new Uint8Array(Buffer.from(attachment.attachment.data).buffer)], attachment.attachment.filename, { type: attachment.attachment.contentType }))
									let component = null;
									if (attachment.type == 0) component = <img src={url} alt="gigattachment" className="h-full border shadow-lg w-full" />;
									else component = <video controls className="h-full w-full border shadow-lg"><source src={url} /></video>
									return <SwiperSlide key={attachment.id}>{component}</SwiperSlide>
								})}
							</Swiper>
						</div>
						{/* Only viewable on mobile */}
						<div className="xl:hidden mb-12">
							<div className="border shadow-md pb-5 bg-white">
								{gig?.multipackages && gig?.packages.length > 1 && <div className="grid grid-cols-3">
									<button className={`col-span-1 border-r py-3 font-semibold border-b ${packageIndex == 0 ? "border-b-transparent" : "bg-gray-100 text-gray-600"}`} onClick={() => setPackageIndex(0)}> Basic </button>
									<button className={`col-span-1 border-r py-3 font-semibold border-b ${packageIndex == 1 ? "border-b-transparent" : "bg-gray-100 text-gray-600"}`} onClick={() => setPackageIndex(1)}> Standard </button>
									<button className={`col-span-1 border-r py-3 font-semibold border-b ${packageIndex == 2 ? "border-b-transparent" : "bg-gray-100 text-gray-600"}`} onClick={() => setPackageIndex(2)}> Premium </button>
								</div>}
								{gig?.packages.length > 0 && <div className="px-6">
									{/* Package Header */}
									<header className="block sm:flex justify-between pt-6">
										{/* Title */}
										<h1 className="font-semibold text-lg text-gray-700"> {gig?.packages[packageIndex].title} </h1>
										{/* Price */}
										<h2 className="text-lg font-semibold text-gray-800 flex items-center">
											<span className="mr-2"> {user?.currency} {commaNumber((gig?.packages[packageIndex].price * orderQuantity).toFixed(2))} </span>
											<div className="relative" onMouseEnter={() => setPriceInfoHovering(true)} onMouseLeave={() => setPriceInfoHovering(false)}>
												<AiOutlineInfoCircle />
												{priceInfoHovering && <div className="absolute bg-[#282828] font-normal text-sm text-white w-64 p-2 right-0 mt-2 rounded-md z-10">
													<p> To keep things simple, Entrelah may round up prices that contain decimals. The number you see here is the price used at checkout </p>
												</div>}
											</div>
										</h2>
									</header>
									{/* Package Description */}
									<p className="text-gray-800 mt-3 mb-4"> {gig?.packages[packageIndex].description} </p>
									<div className="flex text-sm font-bold text-gray-500 mb-3">
										<span className="flex items-center mr-4"> <LuClock3 className="mr-2" size={16} /> {gig?.packages[packageIndex].deliveryDays} Day Delivery </span>
										{gig?.packages[packageIndex].revisions != null && <span className="flex items-center"> <TbRefresh className="mr-2" size={18} /> {gig?.packages[packageIndex].revisions == -1 ? "Unlimited" : gig?.packages[packageIndex].revisions} Revision{gig?.packages[packageIndex].revisions > 1 || gig?.packages[packageIndex].revisions == -1 ? "s" : ""} </span>}
									</div>
									{/* Continue Button */}
									<button className="w-full bg-black hover:bg-[#404145] text-white font-semibold text-lg py-2 rounded-md relative" onClick={handleContinueOverlay}>
										<span> Continue </span>
										<BiRightArrowAlt className="absolute top-[25%] right-3" size={24} />
									</button>
									{gig?.multipackages && gig?.packages.length > 1 && <LinkScroll smooth={true} to="packages" className="justify-center flex mt-2 font-semibold text-[0.95rem] text-gray-800 w-fit mx-auto cursor-pointer"> Compare Packages </LinkScroll>}
								</div>}
							</div>
						</div>
						{/* Description */}
						<div className="border-b border-b-gray-300 mb-6 pb-6">
							<h1 className="text-xl font-bold text-gray-700 mb-6"> About this gig </h1>
							<p className="text-[1.04rem] text-gray-600"> {gig?.description?.split("\n").map((str: string, i: number, arr: string[]) => i == arr.length - i ? str : <Fragment key={i}> {str} <br /> </Fragment>)} </p>
						</div>
						{/* About the seller */}
						<section id="seller" className="mb-12">
							<h1 className="text-xl font-bold text-gray-700 mb-6"> About the seller </h1>
							<div className="flex">
								<img src={gigOwner?.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(gigOwner.avatar.data).buffer)], gigOwner.avatar.filename, { type: gigOwner.avatar.contentType })) : "/placeholder.webp"} alt="profile" className="h-16 w-16 rounded-full" />
								<div className="ml-3">
									<div className="mb-1">
										<Link to={`/users/${gigOwner?.username}?public=true`} className="text-lg font-bold text-gray-600 mr-3 hover:underline">{gigOwner?.displayName ?? "DisplayName"}</Link>
										<Link to={`/users/${gigOwner?.username}?public=true`} className="text-gray-500 hover:underline">@{gigOwner?.username}</Link>
									</div>
									<TotalReviews reviews={gigOwner?.reviewsReceived.filter((r: any) => r.reviewType == "seller")} />
								</div>
							</div>
							{/* Contact me button */}
							<Link to={`/inbox/${gigOwner?.username}`}> <button className="my-5 border border-gray-600 text-gray-600 font-semibold rounded-md bg-white py-[0.3rem] px-5 hover:bg-gray-600 hover:text-white"> Contact Me </button> </Link>
							{/* Description */}
							<div className="border border-gray-300 rounded-md px-6 py-5">
								<div className="flex">
									<div className="w-1/2">
										<h1 className="text-gray-600 text-[1.05rem]"> From </h1>
										<p className="text-gray-600 text-[1.05rem] font-semibold"> {gigOwner?.location ?? "Singapore"} </p>
									</div>
									<div className="w-1/2">
										<h1 className="text-gray-600 text-[1.05rem]"> Member since </h1>
										<p className="text-gray-600 text-[1.05rem] font-semibold"> {new Date(gigOwner?.createdAt).toLocaleDateString("default", { month: "long", year: "numeric" })} </p>
									</div>
								</div>
								<hr className="my-5" />
								<p className="text-[1.02rem] text-gray-700"> {gigOwner?.description.split("\n").map((str: string, i: number, arr: string[]) => i == arr.length - i ? str : <Fragment key={i}> {str} <br /> </Fragment>)} </p>
							</div>
						</section>
						{/* Compare Packages */}
						{gig?.multipackages && gig?.packages.length > 1 && <section id="packages" className="mb-12 hidden md:block">
							<h1 className="text-xl font-bold text-gray-700 mb-6"> Compare Packages </h1>
							<table className="border border-gray-300 w-full">
								<thead>
									<tr>
										<td className="w-1/4 align-top p-4 text-[0.95rem] text-gray-600"> Package </td>
										{gig?.packages.map((p: any, index: number) => <td key={p.id} className="w-1/4 border-l border-gray-300 align-top p-4">
											<h1 className="text-xl font-semibold text-gray-500"> {user?.currency} {commaNumber((p.price * orderQuantity).toFixed(2))} </h1>
											<h2 className="text-xl font-bold text-gray-500 mt-1 mb-2"> {index == 0 ? "Basic" : index == 1 ? "Standard" : "Premium"} </h2>
											<h3 className="text-[0.8rem] mb-2 font-bold text-gray-500 uppercase"> {p.title} </h3>
											<p className="text-[0.9rem] text-gray-700"> {p.description} </p>
										</td>)}
									</tr>
									<tr>
										<td className="border-t border-gray-300 bg-gray-50 px-4 py-2 text-[0.95rem] text-gray-600"> Revisions </td>
										{gig?.packages.map((p: any) => <td key={p.id} className="border-l border-t border-gray-300 bg-gray-50 px-4 py-2 text-[0.95rem] text-center text-gray-700">
											{p.revisions == -1 ? "Unlimited" : p.revisions}
										</td>)}
									</tr>
									<tr>
										<td className="border-t border-gray-300 px-4 py-2 text-[0.95rem] text-gray-600"> Delivery Time </td>
										{gig?.packages.map((p: any) => <td key={p.id} className="border-l border-t border-gray-300 px-4 py-2 text-[0.95rem] text-center text-gray-700">
											{p.deliveryDays} day{p.deliveryDays > 1 ? "s" : ""}
										</td>)}
									</tr>
									<tr>
										<td className="border-t border-gray-300 bg-gray-50 px-4 py-2 text-[0.95rem] text-gray-600 align-top"> Total </td>
										{gig?.packages.map((p: any) => <td key={p.id} className="border-l border-t border-gray-300 bg-gray-50 px-4 py-3">
											<div className="flex flex-col items-center">
												<span className="text-[0.95rem] text-center text-gray-700 mb-2"> {user?.currency} {commaNumber((p.price * orderQuantity).toFixed(2))} </span>
												<button className="mx-auto px-12 bg-black hover:bg-gray-700 text-[0.95rem] text-white font-semibold py-2 rounded-md relative" onClick={() => {
													setPackageIndex(p.index);
													handleContinueOverlay();
												}}> Select </button>
											</div>
										</td>)}
									</tr>
								</thead>
							</table>
						</section>}
						{/* If it's not comparing packages, order details */}
						{!gig?.multipackages && <section className="mb-12">
							<h1 className="text-xl font-bold text-gray-700 mb-6"> Order details </h1>
							<div className="border border-gray-300 w-full p-4 rounded-md">
								<h2 className="text-lg font-semibold text-gray-700"> {gig?.packages[0].title} </h2>
								<p className="text-[0.95rem] text-gray-600 my-3"> {gig?.packages[0].description} </p>
								<div className="flex text-sm font-bold text-gray-500 mb-5">
									<span className="flex items-center mr-4"> <LuClock3 className="mr-2" size={16} /> {gig?.packages[0].deliveryDays} Day Delivery </span>
									{gig?.packages[0].revisions != null && <span className="flex items-center"> <TbRefresh className="mr-2" size={18} /> {gig?.packages[0].revisions == -1 ? "Unlimited" : gig?.packages[0].revisions} Revision{gig?.packages[0].revisions > 1 || gig?.packages[0].revisions == -1 ? "s" : ""} </span>}
								</div>
								<div className="flex justify-between border-t border-b border-gray-300 p-2 items-center">
									<p className="text-gray-500 font-semibold text-[0.95rem]"> Gig Quantity </p>
									{/* Dropdown */}
									<div className="relative" ref={orderRef} onClick={() => setOrderDropdown(!orderDropdown)}>
										<div className="border border-gray-400 p-2 rounded-md flex items-center cursor-pointer">
											<span className="text-gray-800 uppercase"> {orderQuantity} ({user?.currency} {commaNumber((gig?.packages[0].price * orderQuantity).toFixed(2))}) </span>
											<MdKeyboardArrowDown size={22} className="text-gray-500 ml-1" />
										</div>
										{orderDropdown && <ul className="absolute bg-white border border-gray-300 shadow-m w-max h-[12.6rem] overflow-auto mt-2 shadow-md rounded-md z-10">
											{[...Array(20).keys()].map(n => <li key={n} className="py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setOrderQuantity(n + 1)}>
												<span className="text-gray-800 uppercase px-8"> {n + 1} ({user?.currency} {commaNumber((gig?.packages[0].price * (n + 1)).toFixed(2))}) </span>
											</li>)}
										</ul>}
									</div>
								</div>
								<div className="flex justify-end">
									<button className="bg-black hover:bg-[#404145] text-white font-semibold text-lg py-2 rounded-md relative mt-4 px-6" onClick={handleContinueOverlay}> Continue ({gigOwner?.currency} {commaNumber((gig?.packages[0].price * orderQuantity).toFixed(2))}) </button>
								</div>
							</div>
						</section>}
						{/* FAQ */}
						{gig?.faqs.length > 0 && <section className="mb-4">
							<h1 className="text-xl font-bold text-gray-700 mb-6"> FAQ </h1>
							<div>
								{gig?.faqs.map((faq: any, index: number) => <div key={faq.id} className={`pb-4 ${index != gig.faqs.length - 1 ? `border-b border-b-gray-300 mb-4` : ""}`}>
									<h1 className="text-gray-700 font-semibold text-[1.04rem] cursor-pointer flex items-center justify-between" onClick={() => handleFaqClick(index)}>
										<span> {faq.question} </span> 										{faqUncollapsedIndex != index && <MdOutlineKeyboardArrowDown size={22} />}
										{faqUncollapsedIndex == index && <MdOutlineKeyboardArrowUp />}
									</h1>
									{faqUncollapsedIndex == index && <p className="mt-2 text-gray-800 text-[1.02rem]"> {faq.answer} </p>}
								</div>)}
							</div>
						</section>}
						{/* Reviews */}
						{gig?.reviews.length > 0 && <section className="mb-24 mt-8" id="reviews">
							<h1 className="text-xl font-bold text-gray-700 mb-4"> Reviews </h1>
							<SellerReviewsHeader reviews={gig?.reviews} />
							<ul className="mt-8"> {gig?.reviews.map((r: any) => <Review review={r} key={r.id} />)} </ul>
						</section>}
					</div>
					{/* Right */}
					<div className="w-full max-w-[32rem] hidden xl:block">
						<div className="border shadow-md pb-5 bg-white fixed w-[32rem]">
							{gig?.multipackages && gig?.packages.length > 1 && <div className="grid grid-cols-3">
								<button className={`col-span-1 border-r py-3 font-semibold border-b ${packageIndex == 0 ? "border-b-transparent" : "bg-gray-100 text-gray-600"}`} onClick={() => setPackageIndex(0)}> Basic </button>
								<button className={`col-span-1 border-r py-3 font-semibold border-b ${packageIndex == 1 ? "border-b-transparent" : "bg-gray-100 text-gray-600"}`} onClick={() => setPackageIndex(1)}> Standard </button>
								<button className={`col-span-1 border-r py-3 font-semibold border-b ${packageIndex == 2 ? "border-b-transparent" : "bg-gray-100 text-gray-600"}`} onClick={() => setPackageIndex(2)}> Premium </button>
							</div>}
							{gig?.packages.length > 0 && <div className="px-6">
								{/* Package Header */}
								<header className="block 2xl:flex justify-between pt-6">
									{/* Title */}
									<h1 className="font-semibold text-lg text-gray-700"> {gig?.packages[packageIndex].title} </h1>
									{/* Price */}
									<h2 className="text-lg font-semibold text-gray-800 flex items-center">
										<span className="mr-2"> {user?.currency} {commaNumber((gig?.packages[packageIndex].price * orderQuantity).toFixed(2))} </span>
										<div className="relative" onMouseEnter={() => setPriceInfoHovering(true)} onMouseLeave={() => setPriceInfoHovering(false)}>
											<AiOutlineInfoCircle />
											{priceInfoHovering && <div className="absolute bg-[#282828] font-normal text-sm text-white w-64 p-2 right-0 mt-2 rounded-md z-10">
												<p> To keep things simple, Entrelah may round up prices that contain decimals. The number you see here is the price used at checkout </p>
											</div>}
										</div>
									</h2>
								</header>
								{/* Package Description */}
								<p className="text-gray-800 mt-3 mb-4"> {gig?.packages[packageIndex].description} </p>
								<div className="flex text-sm font-bold text-gray-500 mb-3">
									<span className="flex items-center mr-4"> <LuClock3 className="mr-2" size={16} /> {gig?.packages[packageIndex].deliveryDays} Day Delivery </span>
									{![0, null].includes(gig?.packages[packageIndex].revisions) && <span className="flex items-center"> <TbRefresh className="mr-2" size={18} /> {gig?.packages[packageIndex].revisions == -1 ? "Unlimited" : gig?.packages[packageIndex].revisions} Revision{gig?.packages[packageIndex].revisions > 1 || gig?.packages[packageIndex].revisions == -1 ? "s" : ""} </span>}
								</div>
								{/* Continue Button */}
								<button className="w-full bg-black hover:bg-[#404145] text-white font-semibold text-lg py-2 rounded-md relative" onClick={handleContinueOverlay}>
									<span> Continue </span>
									<BiRightArrowAlt className="absolute top-[25%] right-3" size={24} />
								</button>
								{gig?.multipackages && gig?.packages.length > 1 && <LinkScroll offset={-100} to="packages" smooth={true} className="justify-center flex mt-2 font-semibold text-[0.95rem] text-gray-800 w-fit mx-auto cursor-pointer"> Compare Packages </LinkScroll>}
							</div>}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

interface TotalReviewsProps {
	reviews: any[];
}
export function TotalReviews(props: TotalReviewsProps) {
	const totalRatings = props.reviews?.reduce((a, r) => a + ((r.communicationRating + r.accuracyRating + r.recommendationRating) / 3), 0);
	const avgRating = (totalRatings / props.reviews?.length).toFixed(1);

	return <div className="flex items-baseline">
		<BsStarFill className="text-gray-600" size={16.8} />
		<span className="mx-[0.4rem] text-gray-600 font-bold text-[1.05rem]"> {isNaN(parseInt(avgRating)) ? "0" : avgRating} </span>
		<LinkScroll offset={-100} smooth={true} to="reviews" className="text-[1.05rem] text-gray-500 font-semibold tracking-wide underline cursor-pointer"> ({props.reviews?.length}) </LinkScroll>
	</div>;
}

interface StarRatingProps {
	rating: number;
}
function DisplayStarRating({ rating }: StarRatingProps) {
	const stars: any[] = [];
	const fullStars = Math.floor(rating);
	const remainingStars = 5 - rating;
	for (let i = 0; i < fullStars; i++) stars.push(<BsStarFill className="mr-1" size={15} key={i} />);
	if ((Math.floor(remainingStars)) !== remainingStars) stars.push(<BsStarHalf className="mr-1" size={15} key={0.5} />);
	for (let i = 0 + fullStars; i < Math.floor(remainingStars) + fullStars; i++) stars.push(<BsStar className="mr-1" size={15} key={i} />);

	return <span className="flex pr-2 text-gray-700 items-center"> {stars} <span className="ml-1 font-bold"> {rating.toFixed(1)} </span> </span>;
}

interface ReviewsProps {
	reviews: any[];
}
function SellerReviewsHeader({ reviews }: ReviewsProps) {
	const totalRatings = reviews?.reduce((a, r) => a + ((r.communicationRating + r.accuracyRating + r.recommendationRating) / 3), 0);
	const avgRating = totalRatings / reviews?.length;

	const totalCommRatings = reviews?.map(r => r.communicationRating).reduce((a, r) => a + r);
	const avgCommRating = (totalCommRatings / reviews?.length).toFixed(1);

	const totalReccRatings = reviews?.map(r => r.recommendationRating).reduce((a, r) => a + r);
	const avgReccRating = (totalReccRatings / reviews?.length).toFixed(1);

	const totalAccuracyRatings = reviews?.map(r => r.accuracyRating).reduce((a, r) => a + r);
	const avgAccuracyRating = (totalAccuracyRatings / reviews?.length).toFixed(1);

	return (
		<div>
			<div className="block sm:flex items-center">
				<h1 className="text-gray-700 font-semibold text-[1.04rem] mr-0 sm:mr-6"> {reviews?.length} review{reviews?.length > 1 && "s"} for this Gig </h1>
				<DisplayStarRating rating={avgRating} />
			</div>
			<div className="mt-3">
				<hr className="my-2 block sm:hidden" />
				<table className="w-full">
					<caption className="font-semibold text-gray-700 text-left mb-1"> Rating Breakdown </caption>
					<tbody>
						<tr>
							<td className="text-gray-700 py-1"> Seller communication level </td>
							<td className="text-gray-700 py-1 items-right flex justify-end items-center"> <BsStarFill className="mr-1" size={15} /> <span className="ml-1 font-bold"> {avgCommRating} </span> </td>
						</tr>
						<tr>
							<td className="text-gray-700 py-1"> Recommend to friend </td>
							<td className="text-gray-700 items-right flex justify-end items-center"> <BsStarFill className="mr-1" size={15} /> <span className="ml-1 font-bold"> {avgReccRating} </span> </td>
						</tr>
						<tr>
							<td className="text-gray-700 py-1"> Service as described </td>
							<td className="text-gray-700 items-right flex justify-end items-center"> <BsStarFill className="mr-1" size={15} /> <span className="ml-1 font-bold"> {avgAccuracyRating} </span> </td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}

interface ReviewProps {
	review: any;
}
function Review({ review }: ReviewProps) {
	const duration = Date.now() - new Date(review.createdAt).getTime();
	const rating = review.reviewType == "buyer" ? review.buyerRating : (review.communicationRating + review.accuracyRating + review.recommendationRating) / 3;

	return (
		<>
			<hr className="my-8" />
			<li>
				{/* User info */}
				<div className="flex items-center">
					<img src="/placeholder.webp" className="w-12 rounded-full" alt="profile" />
					<div className="block ml-4 items-center py-1">
						<span className="font-semibold text-gray-800 tracking-wide"> {review.reviewer.username} </span>
						<span className="flex text-sm tracking-wider text-[#62646a] items-center"> Singapore </span>
					</div>

				</div>
				{/* Review info */}
				<div className="ml-0 mt-2 sm:mt-0 sm:ml-16">
					{/* Stars */}
					<div className="block sm:flex items-center mt-1">
						<DisplayStarRating rating={rating} />
						<time className="text-[#62646a] tracking-wider text-sm border-l-0 sm:border-l pl-0 sm:pl-3 ml-0 sm:ml-1"> {duration < 60000 ? "Just now" : `${ms(duration, { long: true })} ago`} </time>
					</div>
					<p className="text-[#404145] mt-2"> {review.message} </p>
				</div>
			</li>
		</>
	)
}