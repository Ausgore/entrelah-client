import { FiPackage, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useState, useEffect, Fragment } from "react";
import { OrderDetails } from "./OrderDetails";
import { IconType } from "react-icons";
import tinycolor from "tinycolor2";
import { AiOutlineFile } from "react-icons/ai";
import { RiRocketLine } from "react-icons/ri";
import { Link } from "react-router-dom";

interface OrderActivitiesProps {
	order: any;
}
export function OrderActivities(props: OrderActivitiesProps) {
	const [dates, setDates] = useState<string[]>([]);
	const [orderDetailsCollapsed, setOrderDetailsCollapsed] = useState(true);
	const handleOrderDetailsCollapsed = () => setOrderDetailsCollapsed(!orderDetailsCollapsed);

	useEffect(() => {
		if (props.order) {
			const dates = Array.from(new Set([props.order.createdAt, ...props.order.events.map((oe: any) => oe.createdAt)].map(date => {
				const d = new Date(date);
				d.setUTCHours(23, 59, 59);
				return d.toISOString();
			})));
			setDates(dates);
		}
	}, [props.order]);

	return (
		<>
			{/* Order details */}
			<section className="bg-white shadow-md">
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
			<section className="bg-white shadow-md mt-6 pt-8 pb-4">
				{dates?.map((date, index) => {
					return <Fragment key={date}>
						<article>
							<header className="bg-[#efeff0] w-28 text-center rounded-r-full mb-4">
								<h1 className="text-[#74767e] font-semibold text-[0.92rem]"> {new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} </h1>
							</header>
							{/* All the events under this date */}
							<div className="ml-6">
								{index == 0 && <>
									<div className="flex items-center py-3">
										<EventIcon icon={AiOutlineFile} color="bg-[#eeecff]" />
										<p className="text-[1.08rem] font-semibold text-gray-600 mx-4"> <span> {props.order?.customer.username} </span> placed the order </p>
										<span className="text-sm italic text-gray-400"> {new Date(props.order?.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}, {new Date(props.order?.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} </span>
									</div>
									<div className="flex items-center py-3">
										<EventIcon icon={RiRocketLine} color="bg-[#d7f7e9]" />
										<p className="text-[1.08rem] font-semibold text-gray-600 mx-4"> The order started </p>
										<span className="text-sm italic text-gray-400"> {new Date(props.order?.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}, {new Date(props.order?.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} </span>
									</div>
								</>}
							</div>
						</article>
					</Fragment>
				})}
			</section>
			<p className="text-center mt-4 text-[0.95rem] text-gray-500"> 
				View <Link className="text-blue-500 hover:underline" to={`/inbox/${props.order?.customer.username}`}> conversation</Link> with {props.order?.customer.username} in your inbox 
			</p>
		</>
	)
}

interface EventIconProps {
	icon: IconType;
	color: string;

}
function EventIcon(props: EventIconProps) {
	return <div className={`w-10 h-10 ${props.color} flex justify-center items-center rounded-full`}> <props.icon size={22} color={tinycolor(props.color.substring(4, props.color.length - 1)).darken(25).toString()} /> </div>;
}