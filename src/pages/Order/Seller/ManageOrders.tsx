import { SellerNav } from "@components/SellerNav/SellerNav";
import { useUser } from "@contexts/UserContext";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import api from "@api";
import { Link, useNavigate } from "react-router-dom";
import commaNumber from "comma-number";
import { AiOutlineStar } from "react-icons/ai";

export function ManageOrders() {
	const user = useUser();
	const [orders, setOrders] = useState<any[]>([]);

	const queryParams = new URLSearchParams(location.search);
	const [type, setType] = useState<string>(queryParams.get("type") as string);

	useEffect(() => {
		if (user?.id) api.get(`order/seller/${user?.id}`).then(res => setOrders(res.data));
	}, [user]);

	const filter = (o: any) => {
		if (type == "active" || !type) return o.status == 0 && Date.now() < new Date(new Date(o.createdAt).getTime() + o.deliveryDays * 8.64e+7).getTime();
		else if (type == "late") return o.status == 0 && Date.now() >= new Date(new Date(o.createdAt).getTime() + o.deliveryDays * 8.64e+7).getTime();
		else if (type == "delivered") return o.status == 1;
		else if (type == "completed") return o.status == 2;
		else if (type == "cancelled") return o.status == 3;
	}

	return (
		<>
			<SellerNav />
			<div className="container mx-auto pt-28">
				<div className="mx-4 lg:mx-24">
					<h1 className="text-4xl text-gray-700"> Manage Orders </h1>
					<section className="flex mt-6 uppercase text-[0.92rem] text-gray-400">
						<Tab setType={setType} tab="active" orders={orders?.filter(o => o.status == 0 && Date.now() < new Date(new Date(o.createdAt).getTime() + o.deliveryDays * 8.64e+7).getTime())} />
						<Tab setType={setType} tab="late" orders={orders?.filter(o => o.status == 0 && Date.now() >= new Date(new Date(o.createdAt).getTime() + o.deliveryDays * 8.64e+7).getTime())} />
						<Tab setType={setType} tab="delivered" orders={orders?.filter(o => o.status == 1)} />
						<Tab setType={setType} tab="completed" orders={orders?.filter(o => o.status == 2)} />
						<Tab setType={setType} tab="cancelled" orders={orders?.filter(o => o.status == 3)} />
					</section>
					<section className="mt-8 bg-white border border-gray-200">
						<h1 className="uppercase ml-6 py-3 text-[0.93rem] font-semibold text-gray-800"> {type ?? "Active"} Orders </h1>
						<table className="w-full">
							<thead>
								<tr className="uppercase text-[0.82rem] font-semibold text-gray-400 border-t border-b border-gray-200">
									<td className="pl-1"></td>
									<td className="py-2">Buyer</td>
									<td className="w-96">Gig</td>
									<td>Due on</td>
									{["delivered", "completed"].includes(type) && <td>Delivered at</td>}
									<td>Total</td>
								</tr>
							</thead>
							<tbody>
								{orders.filter(filter).length > 0 && orders?.filter(filter).map((order: any, index) => {
									return <tr key={order.id} className={`text-[0.95rem] text-gray-600 items-center hover:bg-gray-50 ${index != orders.filter(filter).length - 1 ? "border-b border-gray-200" : ""}`}>
										<td className="py-4 px-4 w-4"><AiOutlineStar size={22} className="text-gray-300 cursor-pointer" /></td>
										<td>{order.customer.username}</td>
										<td>
											<Link className="hover:text-blue-500" to={`/orders/${order.id}/activities`}>
												{order.package.gig.title.substring(0, 20)}{order.package.gig.title.length > 20 ? "..." : ""}
											</Link>
										</td>
										<td>{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
										{["delivered", "completed"].includes(type) && <td>{new Date(order.deliveredAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>}
										<td>{user?.currency} {commaNumber((order.price * order.quantity).toFixed(2))}</td>
									</tr>
								})}
							</tbody>
						</table>
						{orders.filter(filter).length == 0 && <div className="py-3 text-sm ml-4 text-gray-600">No {type} orders to show</div>}
					</section>
				</div>
			</div>
		</>
	)
}

interface TabProps {
	tab: string;
	orders: any[];
	setType: Dispatch<SetStateAction<string>>;
}
function Tab(props: TabProps) {
	const navigate = useNavigate();
	const queryParams = new URLSearchParams(location.search);
	const type = queryParams.get("type") as string;

	const handleClick = () => {
		navigate(`?type=${props.tab}`);
		props.setType(props.tab);
	}

	return (
		<div className="flex mr-6 cursor-pointer group" onClick={handleClick}>
			<p className={`${props.tab == type ? "text-black" : "group-hover:text-black"}`}> {props.tab} </p>
			{props.orders?.length > 0 &&
				<div className={`ml-2 bg-[#c5c6c9] text-white px-2 rounded-l-full rounded-r-full text-sm flex justify-between items-center mr-1 ${props.tab == type ? "bg-green-500" : "group-hover:bg-green-500"}`}>
					{props.orders?.length}
				</div>}
		</div>
	)
}