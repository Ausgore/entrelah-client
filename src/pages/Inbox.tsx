import { SellerNav } from "@components/SellerNav/SellerNav";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChangeEvent, useEffect, useState, useRef } from "react";
import { AiOutlineSmile } from "react-icons/ai";
import { BsLightning } from "react-icons/bs";
import { HiPaperClip } from "react-icons/hi";
import { useUser } from "@contexts/UserContext";
import api from "@api";
import { Buffer } from "buffer";
import { format } from "timeago.js";
import { FaChevronLeft } from "react-icons/fa";

export function Inbox() {
	const user = useUser();
	const { username } = useParams();
	const navigate = useNavigate();

	const [lastSentMessages, setLastSentMessages] = useState<any[]>([]);

	useEffect(() => {
		if (user?.username == username) navigate("/inbox");
	}, [user, username]);

	useEffect(() => {
		if (user) api.get(`message/${user?.id}`).then(res => setLastSentMessages(res.data));
	}, [user]);

	useEffect(() => {
		document.body.style.backgroundColor = "white";
		return () => {
			document.body.style.backgroundColor = "#f0f2f5";
		}
	}, []);

	const [secondUser, setSecondUser] = useState<any>();
	const [messages, setMessages] = useState<any[]>([]);
	useEffect(() => {
		if (username && user) {
			api.get(`user/username/${username}`).then(async res => {
				const response = await api.get(`message/${user?.id}/${res.data.id}`);
				setMessages(response.data);
				const { data: lastSentMessages } = await api.get(`message/${user?.id}`);
				setLastSentMessages(lastSentMessages);
				setSecondUser(res.data);
			});
		}
	}, [user, username]);

	const [value, setValue] = useState<string>("");
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

	useEffect(() => {
		const interval = setInterval(async () => {
			if (!secondUser) return clearInterval(interval);
			const { data: newMessages } = await api.get(`message/${user?.id}/${secondUser.id}`);
			setMessages(newMessages);
		}, 1_000);
		return () => clearInterval(interval);
	}, [secondUser]);

	const handleSend = async () => {
		if (!value.length) return;
		await api.post(`message/send/${user?.id}?to=${secondUser.id}`, { content: value });
		const { data: messages } = await api.get(`message/${user?.id}/${secondUser.id}`);
		setMessages(messages);
		const { data: lastSentMessages } = await api.get(`message/${user?.id}`);
		setLastSentMessages(lastSentMessages);
		setValue("");
		contentEndRef.current?.scrollIntoView();
	}

	const contentEndRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		contentEndRef.current?.scrollIntoView();
	}, [secondUser]);

	return (
		<>
			<SellerNav />
			<div className="pt-20 h-screen">
				<div className="h-full w-full flex">
					<div className="flex mt-6 mb-0 md:mb-6 w-full">
						{/* All messages */}
						<div className={`h-full flex-col pl-4 ${!username ? "w-full flex md:w-[25.55rem]" : "hidden md:flex md:w-[32.4rem]"}`}>
							<header className="flex justify-between py-4">
								<h1 className="text-lg font-semibold"> All messages </h1>
							</header>
							{/* Last sent messages */}
							<div className="overflow-auto py-1 pr-2">
								{lastSentMessages?.map(message => {
									const recipient = message.senderId == user?.id ? message.receiver : message.sender;
									return (
										<div key={message.id} onClick={() => navigate(`/inbox/${recipient.username}`)} className={`w-full mb-2 py-4 relative px-2 rounded-md cursor-pointer ${username == recipient.username ? "bg-[#f2f2f2]" : "hover:bg-[#f7f7f7]"}`}>
											<div className="flex">
												<img src={recipient.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(recipient.avatar.data).buffer)], recipient.avatar.filename, { type: recipient.avatar.contentType })) : "/placeholder.webp"} alt="profile" className="rounded-full w-12 h-12" />
												<div className="ml-2 flex flex-col justify-between">
													<h1 className="text-sm font-[700] text-[#282828]">{recipient.username}</h1>
													<p className="text-[0.9rem] text-gray-600">{message.senderId == user?.id ? "Me: " : ""}{message.content.substring(0, 12)}{message.content.length > 12 ? "..." : ""}</p>
												</div>
											</div>
											<div className="flex flex-col justify-between pl-4 absolute right-0 top-0 mr-3 mt-4">
												<div className="text-[0.8rem] text-gray-600">{format(new Date(message.createdAt)).split(" ").splice(0, 2).join(" ")}</div>
											</div>
										</div>
									)
								})}
							</div>
						</div>
						{/* If there's no conversation selected, hide if phone */}
						{!username && <div className="hidden md:flex justify-center items-center w-full border border-gray-300 rounded-3xl ml-2 mr-4">
							<div className="text-center ">
								<img src="/no-selection.webp" className="w-56 mx-auto" />
								<h1 className="mt-6 mb-2 text-[1.5rem] font-bold text-gray-700"> Pick up where you left off </h1>
								<p className="text-[0.98rem] text-gray-500 font-semibold"> Select a conversation and chat away. </p>
							</div>
						</div>}
						{/* If there's a conversation selcted */}
						{username && <>
							<div className={`ml-0 md:ml-2 rounded-t-3xl rounded-b-none md:rounded-b-3xl border border-gray-300 w-full flex flex-col justify-between mr-0 md:mr-4 xl:mr-0`}>
								{/* Header */}
								<header className="border-b border-b-gray-300 py-6 px-4 shadow-sm rounded-t-3xl flex items-center">
									<Link to="/inbox" onClick={() => setSecondUser(null)} className="mr-4 md:hidden"><FaChevronLeft /></Link>
									<Link to={`/users/${secondUser?.username}?public=true`} className="text-lg font-semibold underline md:ml-4">{secondUser?.username}</Link>
								</header>
								{/* Content */}
								<div className="overflow-auto pb-4 pt-16 flex-grow mb-2">
									{messages?.map(message => <div key={message.id} className="hover:bg-gray-50 py-3 px-6 flex">
										<img src={user?.id == message.senderId ? user?.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(user?.avatar.data).buffer)], user?.avatar.filename, { type: user?.avatar.contentType })) : "/placeholder.webp" : secondUser?.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(secondUser?.avatar.data).buffer)], secondUser?.avatar.filename, { type: secondUser?.avatar.contentType })) : "/placeholder.webp"} alt="profile" className="rounded-full w-8 h-8" />
										<div className="ml-2">
											<div className="flex flex-col sm:flex-row text-sm">
												<span className="text-sm font-[600] text-[#282828] mr-2">{message.senderId == user?.id ? "Me" : message.sender.username}</span>
												<span className="text-xs text-gray-500">{new Date(message.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, {new Date(message.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
											</div>
											<p className="text-[0.95rem] text-gray-800 mt-2">{message.content}</p>
										</div>
									</div>)}
									<div ref={contentEndRef} />
								</div>
								{/* Footer */}
								<footer className="w-full left-0 px-6 pb-6 pt-3">
									<textarea
										placeholder="Send message..."
										ref={textareaRef}
										value={value}
										onChange={handleChange}
										className="border border-gray-300 placeholder:text-gray-600 rounded-lg w-full p-2 pr-4 outline-none min-h-[4rem] max-h-[12rem] resize-none overflow-hidden"
									/>
									<div className="flex justify-between mt-2 items-center">
										<div className="flex items-center">
											<div className="relative mr-1 hidden md:block">
												<AiOutlineSmile size={36} className="text-[#74767e] p-[0.4rem] hover:bg-gray-100 rounded-lg cursor-pointer" />
											</div>
											<div className="relative mr-1">
												<HiPaperClip size={36} className="text-[#8b8d96] p-[0.4rem] hover:bg-gray-100 rounded-lg cursor-pointer" />
											</div>
											<div className="relative mr-3 pr-4 border-r border-gray-300">
												<BsLightning size={34} className="text-[#6b6d74] p-[0.4rem] hover:bg-gray-100 rounded-lg cursor-pointer" />
											</div>
											<div className="relative hidden md:block">
												<Link to="/" className="border border-gray-400 rounded-md px-4 py-[0.4rem] font-semibold text-gray-500 hover:text-white hover:bg-gray-500"> Create an Offer </Link>
											</div>
										</div>
										<div className="flex items-center">
											<Link to="/" className="border border-gray-400 rounded-md px-4 py-[0.4rem] font-semibold text-gray-500 hover:text-white hover:bg-gray-500 text-center md:hidden mr-4"> Create an Offer </Link>
											<button className="font-semibold text-gray-500 text-sm mr-2 uppercase text-right mt-0 ml-2" onClick={handleSend}> Send </button>
										</div>
									</div>
								</footer>
							</div>
							{/* Information */}
							<div className={`hidden xl:block w-[32rem] mx-4 px-8`}>
								<h1 className="text-lg font-semibold mb-2">About <Link to={`/users/${secondUser?.username}?public=true`} className="underline hover:text-gray-500 decoration-gray-500">{secondUser?.username}</Link></h1>
								<div className="flex justify-between mb-2 text-sm">
									<p className="text-[#808080]">From</p>
									<p className="font-semibold text-gray-800">{secondUser?.location ?? "Singapore"}</p>
								</div>
								<div className="flex justify-between mb-2 text-sm">
									<p className="text-[#808080]">On Fiverr since</p>
									<p className="font-semibold text-gray-800">{new Date(secondUser?.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</p>
								</div>
								<div className="flex justify-between text-sm">
									<p className="text-[#808080]">Rating</p>
									<p className="font-semibold text-gray-800">CustomerRatingOnly</p>
								</div>
							</div>
						</>}
					</div>
				</div>
			</div>
		</>
	)
}