import { BsStarFill, BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { AiFillHeart, AiFillPlayCircle, AiTwotoneEye } from "react-icons/ai";
import { useUser } from "@/contexts/UserContext";
import { useState, useRef, useEffect, Dispatch } from 'react';
import { MdModeEdit, MdPause } from "react-icons/md";
import { FaChartPie } from "react-icons/fa";
import api from '@api';
import { Buffer } from "buffer";

interface GigCardProps {
	gig: any;
	public?: boolean;
	setViewedUser: Dispatch<any>;
}

export function GigCard(props: GigCardProps) {
	const [gigOwner, setGigOwner] = useState<any>(null);
	useEffect(() => {
		api.get(`user/${props.gig.owner.id}`).then(res => setGigOwner(res.data));
	}, [props.gig]);

	const user = useUser();
	const navigate = useNavigate();
	const [saved, setSaved] = useState(false);
	const [attachment, setAttachment] = useState<any>(null);

	const [isDropmenuVisible, setIsDropmenuVisible] = useState(false);
	const handleDropmenuVisible = () => setIsDropmenuVisible(!isDropmenuVisible);
	const closeDropmenu = () => setIsDropmenuVisible(false);
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleOutsideClick = (e: globalThis.MouseEvent) => {
			if (ref.current && e.target instanceof Node && ref.current.contains(e.target)) return;
			closeDropmenu();
		}
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

	useEffect(() => {
		if (props.gig.usersWhoSaved.map((u: any) => u.id).includes(user?.id)) setSaved(true);
		else setSaved(false);
	}, []);

	useEffect(() => {
		api.get(`gig/${props.gig.id}/attachments?first=true`).then(res => setAttachment(res.data));
	}, [props.gig]);

	const handleHeartClick = async () => {
		if (user) {
			await api.post(`user/${saved ? "unsave" : "save"}/${user.id}?id=${props.gig.id}`);
			const { data } = await api.get(`user/${props.gig.owner.id}`);
			setSaved(!saved);
			props.setViewedUser(data);
		}
	}

	const handlePause = async () => {
		await api.post(`gig/edit/${props.gig.id}`, { status: 2 });
		const { data } = await api.get(`user/${user?.id}`);
		props.setViewedUser(data);
	}

	const handleActivate = async () => {
		await api.post(`gig/edit/${props.gig.id}`, { status: 1 });
		const { data } = await api.get(`user/${user?.id}`);
		props.setViewedUser(data);
	}

	const totalRatings = props.gig.reviews.reduce((a: number, r: any) => a + ((r.communicationRating + r.accuracyRating + r.recommendationRating) / 3), 0);
	const avgRating = (totalRatings / props.gig.reviews.length).toFixed(1);

	return (
		<div className={`bg-white grid-cols-1 relative ${props.public ? "min-h-[339px]" : "min-h-[260px]"} border border-gray-300 box-border shadow-md flex flex-col justify-between`}>
			{/* Dropmenu */}
			{isDropmenuVisible && <div className="absolute w-full h-full bg-white z-[11]" ref={ref}>
				{/* Preview */}
				{props.gig.status !== 0 && <div className="px-4 py-3 hover:bg-gray-100 text-gray-700 cursor-pointer flex items-center"> <AiTwotoneEye size={16} className="mr-3" /> Preview </div>}
				{/* Edit */}
				<Link to={`manage_gigs/edit?tab=overview&id=${props.gig.id}`}>
					<div className="px-4 py-3 hover:bg-gray-100 text-gray-700 cursor-pointer flex items-center"> <MdModeEdit size={16} className="mr-3" /> Edit </div>
				</Link>
				{/* Pause */}
				{props.gig.status == 1 && <div className="px-4 py-3 hover:bg-gray-100 text-gray-700 cursor-pointer flex items-center" onClick={handlePause}> <MdPause size={16} className="mr-3" /> Pause </div>}
				{/* Activate */}
				{props.gig.status == 2 && <div className="px-4 py-3 hover:bg-gray-100 text-gray-700 cursor-pointer flex items-center" onClick={handleActivate}> <AiFillPlayCircle size={16} className="mr-3" /> Activate </div>}
				{/* Statistics */}
				<Link to={`manage_gigs?id=${props.gig.id}`}>
					<div className="px-4 py-3 hover:bg-gray-100 text-gray-700 cursor-pointer flex items-center">
						<FaChartPie size={16} className="mr-3" /> Statistics
					</div>
				</Link>
			</div>}
			{/* Card */}
			<header>
				<Link to={`/users/${props.gig.owner.username}/${props.gig.id}`}>
					{/* Gig Image */}
					{!attachment && <div className={`bg-[#eeeeee] relative ${props.public ? "h-36" : "h-32"} items-center flex`}>
						<img src="/gigplaceholder.webp" alt="gigimg" className="w-32 mx-auto overflow-clip" />
					</div>}
					{attachment && <img
							src={URL.createObjectURL(new File([new Uint8Array(Buffer.from(attachment.attachment.data).buffer)], attachment.attachment.filename, { type: attachment.attachment.contentType }))}
							alt={attachment.attachment.filename}
							className={`${props.public ? "h-36" : "h-32"} w-full`}
					/>}
					{/* For the public card */}
					{props.public && <div>
						<div className="flex ml-3 my-3 items-center" onClick={() => navigate(`/users/${props.gig.owner.username}`)}>
							<img src={gigOwner?.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(gigOwner.avatar.data).buffer)], gigOwner.avatar.filename, { type: gigOwner.avatar.contentType })) : "/placeholder.webp"} alt="userprofile" className="w-7 h-7 rounded-full mr-2" />
							<div className="text-sm text-gray-800 font-semibold"> {props.gig.owner.username} </div>
						</div>
					</div>}
					{/* Gig TItle */}
					<section className={`m-3 text-semibold text-gray-800 ${props.public ? "text-lg" : ""}`}> I will {props.gig.title.substring(0, 30)} </section>
				</Link>
			</header>
			<footer className={`items-center ${props.public ? "" : "flex justify-between m-3"}`}>
				{props.public && <>
					<div className="font-bold border-b pb-2 border-b-gray-200">
						{props.gig.reviews.length > 0 && <div className="flex text-sm text-gray-700 items-center font-bold mx-3">
							<BsStarFill />
							<span className="mx-1 text-[0.92rem]"> {avgRating} </span>
							<span className="text-gray-400 font-normal"> {`(${props.gig.reviews.length})`} </span>
						</div>}
					</div>
					<div className="flex items-center py-1 mx-3 justify-between">
						<AiFillHeart className={`${saved ? "text-red-500" : "text-gray-400"} cursor-pointer`} size={20} onClick={handleHeartClick} />
						<div>
							<div className="uppercase text-xs font-bold text-gray-500"> Starting at </div>
							<div className="text-right text-lg font-semibold text-gray-700"> {user?.currency ?? "USD"} {Number(props.gig?.packages.filter((p: any) => p.index == 0)[0]?.price ?? 5)}</div>
						</div>
					</div>
				</>}
				{!props.public && <>
					<BsThreeDots size={22} className="text-gray-500 cursor-pointer" onClick={handleDropmenuVisible} />
					<span className="text-xs uppercase"> starting at
						<span className="text-base font-bold ml-1 text-gray-600">
							${Number(props.gig?.packages.filter((p: any) => p.index == 0)[0]?.price ?? 5)}
						</span>
					</span>
				</>}
			</footer>
		</div>
	)
}