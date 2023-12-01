import { FiPackage, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useState, useEffect, Fragment, ChangeEvent, useRef, Dispatch, SetStateAction } from "react";
import { OrderDetails } from "./OrderDetails";
import { IconType } from "react-icons";
import tinycolor from "tinycolor2";
import { AiOutlineFile } from "react-icons/ai";
import { RiRocketLine } from "react-icons/ri";
import { LuPackage2 } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@contexts/UserContext";
import api from "@api";
import { Buffer } from "buffer";
import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";

interface OrderActivitiesProps {
	order: any;
	setOrders: Dispatch<SetStateAction<any>>;
}
export function OrderActivities(props: OrderActivitiesProps) {
	const user = useUser();
	const [dates, setDates] = useState<string[]>([]);
	const [orderDetailsCollapsed, setOrderDetailsCollapsed] = useState(true);
	const handleOrderDetailsCollapsed = () => setOrderDetailsCollapsed(!orderDetailsCollapsed);
	const [buyer, setBuyer] = useState<any>();

	useEffect(() => {
		if (props.order) {
			api.get(`user/${props.order.customerId}`).then(res => setBuyer(res.data));
			const dates = Array.from(new Set([props.order.createdAt, ...props.order.events.map((oe: any) => oe.createdAt)].map(date => {
				const d = new Date(date);
				d.setDate(d.getDate() - 1);
				d.setUTCHours(23, 59, 59, 0);
				return d.toISOString();
			})));
			setDates(dates);
		}
	}, [props.order]);

	const [value, setValue] = useState("");
	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	useEffect(() => {
		const { current } = textareaRef;
		if (current) {
			current.style.height = "auto";
			current.style.height = current.scrollHeight + "px";
			if (current.scrollHeight > 196) current.style.overflow = "auto";
			else current.style.overflow = "hidden";
		}
	}, [value]);

	const handleSend = async () => {
		if (!value.length) return;
		await api.post(`order/eventmessage/${props.order.id}`, { content: value, authorId: user?.id });
		setValue("");
		const { data: order } = await api.get(`order/${props.order.id}`);
		props.setOrders(order);
	}

	const handleDeliver = async () => {
		if (!value.length) return;
		await api.post(`order/eventdeliver/${props.order.id}`, { content: value });
		await api.post(`order/update/${props.order.id}`, { status: 1, deliveredAt: new Date() });
		setValue("");
		const { data: order } = await api.get(`order/${props.order.id}`);
		props.setOrders(order);
	}


	return (
		<>
			{/* Order details */}
			<section className="bg-white shadow-md rounded-lg">
				<div className="flex mx-6 py-4 items-center justify-between cursor-pointer" onClick={handleOrderDetailsCollapsed}>
					<div className="flex items-center">
						<EventIcon icon={FiPackage} color="bg-[#ecf1fd]" />
						<p className="text-[1.08rem] ml-4 font-semibold text-gray-500"> Your order details </p>
					</div>
					{orderDetailsCollapsed ? <FiChevronDown size={22} className="text-gray-500" /> : <FiChevronUp size={22} className="text-gray-500" />}
				</div>
				{!orderDetailsCollapsed && <div className="ml-9"> <OrderDetails order={props.order} /> </div>}
			</section>
			{/* Order Activities */}
			<section className="bg-white shadow-md mt-6 pt-5 rounded-lg">
				{dates?.map((date, index) => {
					return <Fragment key={date}>
						<article>
							<header className="bg-[#efeff0] w-28 text-center rounded-r-full mb-4 mt-4">
								<h1 className="text-[#74767e] font-semibold text-[0.92rem]"> {new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} </h1>
							</header>
							{/* All the events under this date */}
							<div className="ml-6">
								{index == 0 && <>
									<div className="flex items-center py-3">
										<EventIcon icon={AiOutlineFile} color="bg-[#eeecff]" />
										<p className="text-[1.08rem] font-semibold text-gray-600 mx-4"> <Buyer buyer={buyer} /> placed the order </p>
										<span className="text-sm italic text-gray-400"> {new Date(props.order?.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}, {new Date(props.order?.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} </span>
									</div>
									<div className="flex items-center py-3">
										<EventIcon icon={RiRocketLine} color="bg-[#d7f7e9]" />
										<p className="text-[1.08rem] font-semibold text-gray-600 mx-4"> The order started </p>
										<span className="text-sm italic text-gray-400"> {new Date(props.order?.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}, {new Date(props.order?.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} </span>
									</div>
								</>}
								{props.order.events.filter((event: any) => new Date(date).getDate() == new Date(event.createdAt).getDate()).map((event: any) => {
									if (event.type == 1) return <MessageEvent key={event.id} event={event} buyer={buyer} />
									else if (event.type == 0) return <DeliverEvent key={event.id} event={event} buyer={buyer} />
									else if (event.type == 2) return <CompletedEvent key={event.id} event={event} buyer={buyer} />
									else if (event.type == 3) return <BuyerReviewEvent key={event.id} event={event} buyer={buyer} />
								})}
							</div>

						</article>
					</Fragment>
				})}
				{![2, 3].includes(props.order?.status) && <div className="pb-4">
					{/* Chatbox */}
					<div className="px-5 mt-8 flex">
						<textarea ref={textareaRef} value={value} onChange={handleChange} className="w-full border border-gray-200 resize-none min-h-[4rem] max-h-[10rem] py-1 px-3 outline-none" />
						<button className="font-semibold text-gray-500 text-sm uppercase text-right mt-0 ml-4" onClick={handleSend}> Send </button>
					</div>
					{/* Deliver */}
					{[0, 1].includes(props.order?.status) && <button className="font-semibold text-sm uppercase text-right ml-5 mt-4 px-4 py-2 border rounded-md bg-red-500 text-white hover:bg-red-600" onClick={handleDeliver}>
						Deliver
					</button>}
				</div>}
				{props.order?.status == 2 && <div className="flex border-l-[5px] border-t border-t-gray-300 border-l-red-500 p-4 rounded-bl-lg items-center mt-4">
					<img src={user?.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(user.avatar.data).buffer)], user.avatar.filename, { type: user.avatar.contentType })) : "/placeholder.webp"} alt="profile" className="rounded-full w-10 h-10 mr-4" />
					<Link to={`/inbox/${buyer?.username}`} className="font-bold text-red-500 text-[1.08rem]">Your order is complete. If you need to contact the buyer. <span className="ml-2 text-blue-700 hover:underline underline-offset-1">Go to inbox</span></Link>
				</div>}
			</section>
			<p className="text-center mt-4 mb-20 text-[0.95rem] text-gray-500">
				View <Link className="text-blue-500 hover:underline" to={`/inbox/${props.order?.customer.username}`}> conversation</Link> with {props.order?.customer.username} in your inbox
			</p>
		</>
	)
}

interface BuyerProps {
	buyer: any;
}
const Buyer = (props: BuyerProps) => <Link to={`/users/${props.buyer?.username}?public=true`} className="text-red-400 cursor-pointer hover:underline underline-offset-2">{props.buyer?.username}</Link>

interface EventIconProps {
	icon: IconType;
	color: string;

}
function EventIcon(props: EventIconProps) {
	return <div className={`w-10 h-10 ${props.color} flex justify-center items-center rounded-full`}> <props.icon size={22} color={tinycolor(props.color.substring(4, props.color.length - 1)).darken(25).toString()} /> </div>;
}

interface EventProps {
	event: any;
	buyer: any;
}
function MessageEvent(props: EventProps) {
	const user = useUser();
	const navigate = useNavigate();

	const [collapsed, setCollapsed] = useState(false);
	const handleCollapse = () => setCollapsed(!collapsed);

	return <div key={props.event.id} className="flex items-start py-2">
		{/* Profile Picture */}
		{props.event.metadata.authorId != user?.id && <img src={props.buyer?.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(props.buyer.avatar.data).buffer)], props.buyer.avatar.filename, { type: props.buyer.avatar.contentType })) : "/placeholder.webp"} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => navigate(`/users/${props.buyer?.username}?public=true`)} />}
		{props.event.metadata.authorId == user?.id && <img src={user?.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(user.avatar.data).buffer)], user.avatar.filename, { type: user.avatar.contentType })) : "/placeholder.webp"} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => navigate(`/users/${user?.username}?public=true`)} />}
		{/* Content */}
		<div className="ml-4 w-full">
			<div className="flex justify-between cursor-pointer pb-2 mr-6 items-center" onClick={handleCollapse}>
				<h1 className="font-semibold text-gray-600 text-[1.08rem]">{props.event.metadata.authorId == user?.id ? <>You sent <Buyer buyer={props.buyer} /> a message</> : <><Buyer buyer={props.buyer} /> sent a message</>}</h1>
				<span className="text-gray-500 italic text-[0.9rem] flex-grow ml-4">{new Date(props.event.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, {new Date(props.event.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
				{collapsed ? <FiChevronDown /> : <FiChevronUp />}
			</div>
			<hr className="mb-3" />
			{!collapsed && <p className="pb-6 text-gray-600">{props.event.metadata.content}</p>}
		</div>
	</div>
}

function DeliverEvent(props: EventProps) {
	const navigate = useNavigate();
	const user = useUser();
	const [collapsed, setCollapsed] = useState(false);
	const handleCollapse = () => setCollapsed(!collapsed);

	return <div className="flex items-start py-2">
		{/* Profile Picture */}
		<EventIcon icon={LuPackage2} color="bg-[#ffe9f7]" />
		<div className="ml-4 w-full">
			<div className="flex justify-between cursor-pointer pb-2 mr-6 items-center" onClick={handleCollapse}>
				<h1 className="font-semibold text-gray-600 text-[1.08rem]">You delivered the order </h1>
				<span className="text-gray-500 italic text-[0.9rem] flex-grow ml-4">{new Date(props.event.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, {new Date(props.event.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
				{collapsed ? <FiChevronDown /> : <FiChevronUp />}
			</div>
			<hr className="mb-4" />
			{!collapsed && <div className="mb-6 border mr-6">
				<header className="border-b font-semibold text-[1.1rem] uppercase text-gray-500 bg-gray-50 py-1 px-6">Delivery</header>
				<div className="py-5 flex items-start px-6">
					<img src={user?.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(user.avatar.data).buffer)], user.avatar.filename, { type: user.avatar.contentType })) : "/placeholder.webp"} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => navigate(`/users/${user?.username}?public=true`)} />
					<div className="ml-4 w-full">
						<h1 className="font-semibold text-gray-600 text-[1.08rem]">Me</h1>
						<p className="text-gray-600">{props.event.metadata.content}</p>
					</div>
				</div>
			</div>}
		</div>
	</div>
}

function CompletedEvent(props: EventProps) {
	return <div className="flex items-center py-3">
		<EventIcon icon={AiOutlineFile} color="bg-[#eeecff]" />
		<p className="text-[1.08rem] font-semibold text-gray-600 mx-4"> The order was completed </p>
		<span className="text-sm italic text-gray-400"> {new Date(props.event.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}, {new Date(props.event.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} </span>
	</div>
}

function BuyerReviewEvent(props: EventProps) {
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(false);
	const handleCollapse = () => setCollapsed(!collapsed);
	const { metadata: review } = props.event;
	const averageRating = (review.communicationRating + review.accuracyRating + review.recommendationRating) / 3;
	const fullStars = Math.floor(averageRating);
	const halfStars = averageRating % 1 != 0 ? 1 : 0;
	const emptyStars = 5 - fullStars - halfStars;
	const stars = [];
	for (let i = 0; i < fullStars; i++) stars.push(<BsStarFill key={`f${i}`} size={15} color="#ffb33e" className="mr-1" />);
	for (let i = 0; i < halfStars; i++) stars.push(<BsStarHalf key={`h${i}`} size={15} color="#ffb33e" className="mr-1" />);
	for (let i = 0; i < emptyStars; i++) stars.push(<BsStar key={i} size={15} color="#ffb33e" className="mr-1" />)

	return <div className="flex items-start py-2">
		<EventIcon icon={BsStar} color="bg-[#efefef]" />
		<div className="ml-4 w-full">
			<div className="flex justify-between cursor-pointer pb-2 mr-6 items-center" onClick={handleCollapse}>
				<h1 className="font-semibold text-gray-600 text-[1.08rem]"><Buyer buyer={props.buyer} /> gave you a {averageRating.toFixed(1)} review </h1>
				<span className="text-gray-500 italic text-[0.9rem] flex-grow ml-4">{new Date(props.event.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, {new Date(props.event.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
				{collapsed ? <FiChevronDown /> : <FiChevronUp />}
			</div>
			<hr className="mb-4" />
			{!collapsed && <div className="mb-6 border mr-6">
				<header className="border-b font-semibold text-[1.1rem] uppercase text-gray-500 bg-gray-50 py-1 px-6"><Buyer buyer={props.buyer} />'s review</header>
				<div className="py-5 flex items-start px-6">
					<img src={props.buyer?.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(props.buyer.avatar.data).buffer)], props.buyer.avatar.filename, { type: props.buyer.avatar.contentType })) : "/placeholder.webp"} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => navigate(`/users/${props.buyer?.username}?public=true`)} />
					<div className="ml-4 w-full">
						<h1 className="font-semibold text-gray-600 text-[1.08rem] flex items-center">
							<Buyer buyer={props.buyer} />'s message
							<span className="ml-4 mr-1 flex">{stars}</span>
							<span className="text-[#ffb33e] font-bold">{averageRating.toFixed(1)}</span>
						</h1>
						<p className="text-gray-600">{props.event.metadata.message}</p>
					</div>
				</div>
			</div>}
		</div>
	</div>
}