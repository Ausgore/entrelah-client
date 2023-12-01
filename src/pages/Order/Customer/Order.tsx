import { useState, useEffect, useRef, ChangeEvent, Dispatch, SetStateAction } from "react";
import api from "@api";
import { Buffer } from "buffer";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@contexts/UserContext";
import commaNumber from "comma-number";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { LuPackageOpen } from "react-icons/lu";
import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";

interface OrderProps {
	order: any;
	setOrder: Dispatch<SetStateAction<any>>;
}

export function Order(props: OrderProps) {
	const user = useUser();
	const [attachment, setAttachment] = useState<any>();
	useEffect(() => {
		api.get(`gig/${props.order.package.gigId}/attachments?first=true`).then(res => setAttachment(res.data));
	}, [props.order]);

	const [showMore, setShowMore] = useState(false);
	const handleShowMore = () => setShowMore(!showMore);

	const createdDate = new Date(props.order.createdAt);
	const deliveryDate = new Date(createdDate);
	deliveryDate.setDate(createdDate.getDate() + props.order.deliveryDays);

	const [seller, setSeller] = useState<any>();
	useEffect(() => {
		api.get(`user/${props.order.package.gig.ownerId}`).then(res => setSeller(res.data));
	}, [props.order]);

	const [value, setValue] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value.replace(/\/n/g, "\n"));
	const handleSend = async () => {
		setValue("");
		if (!value.length) return;
		await api.post(`order/eventmessage/${props.order.id}`, { content: value, authorId: user?.id });
		const { data: order } = await api.get(`order/${props.order.id}`);
		props.setOrder(order);
	}

	useEffect(() => {
		const interval = setInterval(async () => {
			const { data } = await api.get(`order/${props.order.id}`);
			props.setOrder(data);
		}, 1_000);
		return () => clearInterval(interval);
	}, [props.order]);

	return <>
		<div className="mt-12 hidden lg:block mx-12 xl:mx-48 mb-12">
			{/* Header */}
			<header className="border border-gray-300 bg-white">
				<div className="justify-between flex items-start p-4">
					<div className="flex">
						{attachment && <img
							src={URL.createObjectURL(new File([new Uint8Array(Buffer.from(attachment?.attachment.data).buffer)], attachment?.attachment.filename, { type: attachment?.attachment.contentType }))}
							alt={attachment?.attachment.filename}
							className="h-[5rem]"
						/>}
						<div className="ml-4">
							<Link to={`/users/${props.order.package.gig.owner.username}/${props.order.package.gigId}`} target="_blank" className="text-lg ledaing-[0rem] font-bold text-gray-700  hover:text-red-500 cursor-pointer">{props.order.package.gig.title}</Link>
							<p className="pt-1 text-xs text-gray-500">
								<span>Seller: </span>
								<Link className="text-red-500 border-r border-gray-400 pr-3 mr-3" to={`/users/${props.order.package.gig.owner.username}`}>{props.order.package.gig.owner.username}</Link>
								<span className="text-gray-600">{new Date(props.order.createdAt).toLocaleDateString("en-GB", { month: "long", day: "2-digit", year: "numeric" })}</span>
							</p>
						</div>
					</div>
					<div>
						<h1 className="text-xl text-gray-700 font-bold">{user?.currency} {commaNumber((props.order.price * props.order.quantity).toFixed(2))}</h1>
						<button className="text-red-500 text-sm flex items-center cursor-pointer" onClick={handleShowMore}><span className="mr-2">Show More</span>{showMore ? <FiChevronUp /> : <FiChevronDown />}</button>
					</div>
				</div>
				{showMore && <div className="border-t text-sm border-gray-300">
					<p className="mx-3 py-2">{props.order.description}</p>
					<hr className="border-gray-300" />
					<div className="py-2 px-3">
						<table className="w-full">
							<thead>
								<tr className="font-bold text-gray-600">
									<td>Item</td>
									<td className="text-right min-w-[7rem] w-[7rem] max-w-[10rem]">Quantity</td>
									<td className="text-right min-w-[7rem] w-[7rem] max-w-[10rem]">Duration</td>
									<td className="text-right min-w-[7rem] w-[7rem] max-w-[10rem]">Amount</td>
								</tr>
							</thead>
							<tbody>
								<tr className="font-bold text-gray-600">
									<td className="pt-2">{props.order.title}</td>
									<td className="text-right">{props.order.quantity}</td>
									<td className="text-right">{props.order.deliveryDays} Day{props.order.deliveryDays == 1 ? "" : "s"}</td>
									<td className="text-right">{user?.currency} {props.order.price}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<hr className="border-gray-300" />
					<div className="flex justify-between mx-3 py-2 font-bold text-gray-600">
						<p>Subtotal</p>
						<p>{user?.currency} {commaNumber((props.order.price * props.order.quantity).toFixed(2))}</p>
					</div>
					<hr className="border-gray-300" />
					<div className="flex justify-end mr-3 pb-4 pt-2 font-bold text-gray-600">
						<p><span className="mr-2">Total</span> {user?.currency} {commaNumber((props.order.price * props.order.quantity).toFixed(2))}</p>
					</div>
				</div>}
			</header>
			<div className="flex items-center w-full my-6">
				<hr className="border-gray-400 flex-grow" />
				<p className="text-gray-400 mx-4 text-[0.95rem]">
					<span className="border-r border-gray-400 mr-3 pr-3 font-semibold text-gray-600">Order Started</span>
					Delivery due on: {deliveryDate.toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })}
				</p>
				<hr className="border-gray-400 flex-grow" />
			</div>
			<div className="bg-white border-b border-x border-gray-300">
				{props.order.events.map((event: any) => {
					// Sending message
					if (event.type == 1) return <MessageEvent seller={seller} event={event} key={event.id} />
					// Delivery
					if (event.type == 0) return <DeliverEvent seller={seller} event={event} order={props.order} setOrder={props.setOrder} key={event.id} />
					// Buyer's Review
					if (event.type == 3) return <BuyerReview seller={seller} event={event} order={props.order} key={event.id} />
				})}
				{props.order.events.length == 0 && <div className="mx-3 flex justify-center text-center py-10">
					<p className="text-gray-400 font-semibold text-lg">There's nothing here...</p>
				</div>}
				<footer>
					{!props.order.events.map((e: any) => e.type).filter((t: number) => t == 3).length && props.order.status == 2 && <WritingReviewSection order={props.order} setOrder={props.setOrder} />}
					{/* If completed */}
					{props.order.status == 2 && <>
						<div className="bg-repeat-x bg-center w-full h-[5px] bg-[url('https://assetsv2.fiverrcdn.com/assets/v2_backgrounds/bg-order-completed-3befd091f5bab6ae14c28c0b49425072.png')]" />
						<div className="py-5 bg-[#d2eaff] px-24">
							<div className="flex justify-center"><LuPackageOpen color="#00698c" size={36} /></div>
							<div className="flex items-center pt-2">
								<hr className="border-[#00698c] flex-grow" />
								<span className="uppercase font-bold text-xs mx-6 text-[#00698c]">Order completed!</span>
								<hr className="border-[#00698c] flex-grow" />
							</div>
						</div>
						<div className="bg-repeat-x bg-center w-full h-[5px] bg-[url('https://assetsv2.fiverrcdn.com/assets/v2_backgrounds/bg-order-completed-3befd091f5bab6ae14c28c0b49425072.png')] transform rotate-180 absolute bg-transparent" />
						<p className="text-[0.95rem] text-center py-5 text-gray-700">This order is complete. Click <Link to={`/inbox/${seller?.username}`} className="text-red-500">here</Link> to contact the seller.</p>
					</>}
					{/* Not completed */}
					{props.order.status != 2 &&
						<div className="px-5 my-4 flex">
							<textarea ref={textareaRef} value={value} onChange={handleChange} className="w-full border text-[0.85rem] border-gray-200 resize-none min-h-[4rem] max-h-[10rem] py-1 px-3 outline-none" />
							<button className="font-semibold text-gray-500 text-sm uppercase text-right mt-0 ml-4" onClick={handleSend}> Send </button>
						</div>}
				</footer>
			</div >
		</div >
	</>
}

interface WritingReviewSectionProps {
	order: any;
	setOrder: Dispatch<SetStateAction<any>>;
}
function WritingReviewSection(props: WritingReviewSectionProps) {
	const user = useUser();
	const [communication, setCommunication] = useState(1);
	const [recommended, setRecommended] = useState(1);
	const [accuracy, setAccuracy] = useState(1);

	const [value, setValue] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value.replace(/\/n/g, "\n"));
	const handleReviewSubmit = async () => {
		setValue("");
		const { data } = await api.post(`review/create`, {
			senderId: user?.id,
			receiverId: props.order.package.gig.ownerId,
			reviewType: "seller",
			message: value,
			gigId: props.order.package.gigId,
			communicationRating: communication,
			recommendationRating: recommended,
			accuracyRating: accuracy
		});
		await api.post(`order/events/buyer_review/${props.order.id}`, data);
		const { data: order } = await api.get(`order/${props.order.id}`);
		props.setOrder(order);
	}


	return <>
		<hr className="border-gray-300" />
		<div className="my-4 py-4 mx-4">
			<div className="text-center">
				<h1 className="text-lg font-bold text-red-500 uppercase">Write a review</h1>
				<p className="text-gray-600 text-[0.9rem] mt-1 mb-3">Let others know how was your experience with this seller.</p>
				<div className="text-left flex justify-center">
					{/* Rating */}
					<div>
						<table className="w-full items-center">
							<tbody>
								<tr>
									<td className="text-gray-600 py-1 text-[0.85rem]"> Seller communication level </td>
									<StarRating value={communication} setValue={setCommunication} />
								</tr>
								<tr>
									<td className="text-gray-600 py-1 text-[0.85rem]"> Recommend to friend </td>
									<StarRating value={recommended} setValue={setRecommended} />
								</tr>
								<tr>
									<td className="text-gray-600 py-1 text-[0.85rem]"> Service as described </td>
									<StarRating value={accuracy} setValue={setAccuracy} />
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div className="flex">
					<textarea value={value} onChange={handleChange} ref={textareaRef} className="border border-gray-300 mt-4 min-h-[4rem] max-h-[10rem] w-full outline-none resize-none p-2 text-[0.92rem] rounded" placeholder="What was your experience like?"></textarea>
					<button className="font-semibold text-gray-500 text-sm uppercase text-right mt-0 ml-4 self-end" onClick={handleReviewSubmit}> Send </button>
				</div>
			</div>
		</div>
	</>
}

interface StarRatingProps {
	value: number;
	setValue?: Dispatch<SetStateAction<number>>;
	displayValue?: boolean;
}
const StarRating = (props: StarRatingProps) => <td className="text-gray-700 py-1 items-right flex justify-end items-center pl-4 pr-3">
	<div className="mr-1 text-[#ffb33e] cursor-pointer" onClick={() => props.setValue && props.setValue(1)}>{props.value > 0 ? <BsStarFill size={15} /> : <BsStar size={15} />}</div>
	<div className="mr-1 text-[#ffb33e] cursor-pointer" onClick={() => props.setValue && props.setValue(2)}>{props.value > 1 ? <BsStarFill size={15} /> : <BsStar size={15} />}</div>
	<div className="mr-1 text-[#ffb33e] cursor-pointer" onClick={() => props.setValue && props.setValue(3)}>{props.value > 2 ? <BsStarFill size={15} /> : <BsStar size={15} />}</div>
	<div className="mr-1 text-[#ffb33e] cursor-pointer" onClick={() => props.setValue && props.setValue(4)}>{props.value > 3 ? <BsStarFill size={15} /> : <BsStar size={15} />}</div>
	<div className={`${props.displayValue ? "mr-1" : "mr-4"} text-[#ffb33e] cursor-pointer`} onClick={() => props.setValue && props.setValue(5)}>{props.value > 4 ? <BsStarFill size={15} /> : <BsStar size={15} />}</div>
	{props.displayValue && <span className="text-[#ffb33e] font-bold mr-4">{props.value.toFixed(1)}</span>}
</td>

interface EventProps {
	seller: any;
	event: any;
	order?: any;
	setOrder?: Dispatch<SetStateAction<any>>;
}
function MessageEvent(props: EventProps) {
	const user = useUser();
	const navigate = useNavigate();

	return <div className="flex items-start p-4 border-t border-gray-300">
		{/* Profile Picture */}
		{props.event.metadata.authorId != user?.id && <img src={props.seller?.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(props.seller.avatar.data).buffer)], props.seller.avatar.filename, { type: props.seller.avatar.contentType })) : "/placeholder.webp"} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => navigate(`/users/${props.seller?.username}?public=true`)} />}
		{props.event.metadata.authorId == user?.id && <img src={user?.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(user.avatar.data).buffer)], user.avatar.filename, { type: user.avatar.contentType })) : "/placeholder.webp"} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => navigate(`/users/${user?.username}?public=true`)} />}
		<div className="ml-3 flex flex-row justify-end min-h-[4rem]">
			<div className="flex flex-col justify-between">
				<div>
					{/* Username */}
					<h1 onClick={() => { if (user?.id != props.event.metadata.authorId) navigate(`/users/${props.seller?.username}?public=true`) }} className={`font-bold ${user?.id == props.event.metadata.authorId ? "text-gray-700" : "text-red-500 hover:underline cursor-pointer"}`}>{user?.id == props.event.metadata.authorId ? "Me" : props.seller?.username}</h1>
					{/* Text */}
					<p className="mt-1">{props.event.metadata.content}</p>
				</div>
				{/* Footer */}
				<p className="text-xs text-gray-400 mt-6">{new Date(props.event.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} {new Date(props.event.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
			</div>
		</div>
	</div>
}

function DeliverEvent(props: EventProps) {
	const navigate = useNavigate();

	const handleComplete = async () => {
		const { data: order } = await api.post(`order/complete/${props.order.id}`);
		props.setOrder!(order);
	}

	return <div className="p-4 border-t border-gray-300">
		<div className="flex flex-col justify-center text-center items-center w-full">
			<LuPackageOpen color="#00698c" size={36} />
			<h1 className="text-[#00698c] uppercase text-[0.85rem] font-bold">Here's your delivery!</h1>
			{props.order?.status == 1 && <button onClick={handleComplete} className="text-[0.9rem] mt-2 py-2 px-4 rounded font-semibold bg-[#00698c] text-white hover:bg-[#005370]">Click to complete order</button>}
			{props.order?.status == 2 && <p className="text-[0.9rem] mt-1 text-gray-600">This order has been marked as completed</p>}
		</div>
		<div className="flex items-start">
			{/* Profile Picture */}
			<img src={props.seller?.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(props.seller.avatar.data).buffer)], props.seller.avatar.filename, { type: props.seller.avatar.contentType })) : "/placeholder.webp"} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => navigate(`/users/${props.seller?.username}?public=true`)} />
			<div className="ml-3 flex flex-row justify-end min-h-[4rem]">
				<div className="flex flex-col justify-between">
					<div>
						{/* Username */}
						<h1 onClick={() => navigate(`/users/${props.seller?.username}?public=true`)} className="font-bold text-red-500 hover:underline cursor-pointer">{props.seller?.username}</h1>
						{/* Text */}
						<p className="mt-1">{props.event.metadata.content}</p>
					</div>
					{/* Footer */}
					<p className="text-xs text-gray-400 mt-6">{new Date(props.event.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} {new Date(props.event.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
				</div>
			</div>
		</div>
	</div>
}

function BuyerReview(props: EventProps) {
	const user = useUser();
	const navigate = useNavigate();

	useEffect(() => console.log(props.event), []);
	const { metadata: review } = props.event;
	const averageRating = (review.accuracyRating + review.communicationRating + review.recommendationRating) / 3;
	const fullStars = Math.floor(averageRating);
	const halfStars = averageRating % 1 != 0 ? 1 : 0;
	const emptyStars = 5 - fullStars - halfStars;
	const stars = [];
	for (let i = 0; i < fullStars; i++) stars.push(<BsStarFill key={`f${i}`} size={15} color="#ffb33e" className="mr-1" />);
	for (let i = 0; i < halfStars; i++) stars.push(<BsStarHalf key={`h${i}`} size={15} color="#ffb33e" className="mr-1" />);
	for (let i = 0; i < emptyStars; i++) stars.push(<BsStar key={i} size={15} color="#ffb33e" className="mr-1" />)

	return <div className="flex items-start p-4 border-t border-gray-300">
		<img src={user?.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(user.avatar.data).buffer)], user.avatar.filename, { type: user.avatar.contentType })) : "/placeholder.webp"} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => navigate(`/users/${user?.username}?public=true`)} />
		<div className="ml-3 flex flex-col">
				<div>
					{/* Username */}
					<h1 className="font-bold flex items-center text-gray-700">
						<span className="mr-4">Me</span>
						{stars}
						<span className="ml-1 text-[#ffb33e]">{averageRating.toFixed(1)}</span>
					</h1>
					{/* Text */}
					<p className="mt-1 mb-3">{review.message}</p>
					<table>
						<tbody>
							<tr>
								<td className="text-gray-600 py-1 font-bold text-[0.9rem]"> Seller communication level </td>
								<StarRating value={review.communicationRating} displayValue />
							</tr>
							<tr>
								<td className="text-gray-600 py-1 font-bold text-[0.9rem]"> Recommend to friend </td>
								<StarRating value={review.recommendationRating} displayValue />
							</tr>
							<tr>
								<td className="text-gray-600 py-1 font-bold text-[0.85rem]"> Service as described </td>
								<StarRating value={review.accuracyRating} displayValue />
							</tr>
						</tbody>
					</table>
				</div>
				{/* Footer */}
				<p className="text-xs text-gray-400 mt-6">{new Date(props.event.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} {new Date(props.event.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
			</div>
	</div>
}