import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { OrderDetails } from "./OrderDetails";
import { OrderActivities } from "./OrderActivities";
import { SellerNav } from "@components/SellerNav/SellerNav";
import api from "@api";
import { Buffer } from "buffer";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useUser } from "@contexts/UserContext";
import commaNumber from "comma-number";

export function Order() {
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();
	const tab = location.pathname.split("/")[location.pathname.split("/").length - 1];
	const [order, setOrder] = useState<any>();
	const [attachment, setAttachment] = useState<any>();
	const user = useUser();

	
	useEffect(() => {
		api.get(`order/${id}`).then(async res => {
			setOrder(res.data);
			const response = await api.get(`gig/${res.data.package.gigId}/attachments?first=true`);
			setAttachment(response.data);
		}).catch(() => navigate("/404"));
	}, [id]);

	useEffect(() => {
		if (order?.customerId == user?.id) navigate(`/users/${user?.username}/orders/${order?.id}`, { replace: true });
	}, [order]);

	useEffect(() => {
		if (!location.pathname.endsWith(`${id}/activities`) && !location.pathname.endsWith(`${id}/details`)) navigate(`/orders/${id}/activities`);
	}, []);

	const [orderDetailsCollapsed, setOrderDetailsCollapsed] = useState(false);
	const handleOrderDetailsCollapsed = () => setOrderDetailsCollapsed(!orderDetailsCollapsed);

	return (
		<>
			<SellerNav />
			<div className="pt-32 container mx-auto">
				<div className="mx-4">
					{/* Header */}
					<header className="flex border-b border-b-gray-300 mb-6">
						<Link to={`/orders/${id}/activities`} className={`uppercase font-semibold text-[1.08rem] mr-8 border-b-[2px] ${tab == "activities" ? "text-red-500 border-b-red-500" : "text-gray-400 border-b-transparent"}`}> Activity </Link>
						<Link to={`/orders/${id}/details`} className={`uppercase font-semibold text-[1.08rem] border-b-[2px] ${tab == "details" ? "text-red-500 border-b-red-500" : "text-gray-400 border-b-transparent"}`}> Details </Link>
					</header>
					{/* Body */}
					<div className="flex justify-between relative">
						{/* Left */}
						<div className="w-full mr-12">
							{location.pathname.endsWith(`${id}/activities`) && <OrderActivities setOrders={setOrder} order={order} />}
							{location.pathname.endsWith(`${id}/details`) && <OrderDetails order={order} className="pt-8 shadow-lg" />}
						</div>
						{/* Right */}
						<div className="w-full max-w-[20rem] hidden xl:block">
							{/* Order details */}
							<div className="bg-white shadow-md fixed w-[20rem] py-4 rounded-lg">
								<header className="mx-4 mb-4">
									<div className="flex justify-between mb-3 items-center cursor-pointer" onClick={handleOrderDetailsCollapsed}>
										<h1 className="text-xl font-semibold text-gray-700"> Order details </h1>
										{orderDetailsCollapsed ? <FiChevronDown /> : <FiChevronUp />}
									</div>
									<div className="flex">
										{attachment && <img
											src={URL.createObjectURL(new File([new Uint8Array(Buffer.from(attachment.attachment.data).buffer)], attachment.attachment.filename, { type: attachment.attachment.contentType }))}
											alt={attachment.attachment.filename}
											className="h-16 w-24 rounded-md"
										/>}
										<div className="ml-3 relative w-32">
											<p className="text-sm text-gray-700 font-semibold"> I will {order?.package.gig.title.substr(0, 20)}{order?.package.gig.title.length > 20 && "..."} </p>
											<p className={`absolute bottom-0 text-xs font-semibold px-1 text-white ${order?.status == 0 ? "" : order?.status == 2 ? "bg-[#1dbf73]" : "bg-[#74767e]"}`}> {order?.status == 0 ? "Active" : order?.status == 2 ? "Completed" : order?.status == 1 ? "Delivered" : "Cancelled"} </p>
										</div>
									</div>
								</header>
								{!orderDetailsCollapsed && <div className="mx-4 pb-2">
									<div className="flex justify-between items-center">
										<p className="text-[0.92rem] font-semibold text-gray-500"> Ordered by </p>
										<Link to={`/users/${order?.customer.username}`}> <p className="font-bold text-[0.92rem] text-gray-600 hover:underline cursor-pointer"> {order?.customer.username} </p> </Link>
									</div>
									<div className="flex justify-between items-center my-2">
										<p className="text-[0.92rem] font-semibold text-gray-500"> Delivery date </p>
										<p className="font-bold text-[0.92rem] text-gray-600"> {new Date(order?.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}, {new Date(order?.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} </p>
									</div>
									<div className="flex justify-between items-center">
										<p className="text-[0.92rem] font-semibold text-gray-500"> Total price </p>
										<p className="font-bold text-[0.92rem] text-gray-600"> {user?.currency} {commaNumber((order?.price * order?.quantity).toFixed(2))} </p>
									</div>
								</div>}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}