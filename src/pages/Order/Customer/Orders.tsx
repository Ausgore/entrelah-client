import CustomerNav from "@components/CustomerNav/CustomerNav";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@api";
import { useUser } from "@contexts/UserContext";
import { Order } from "./Order";
import commaNumber from "comma-number";
export function Orders() {
	const user = useUser();
	const navigate = useNavigate();
	const { id, username } = useParams();
	const [loading, setLoading] = useState(true);

	const [order, setOrder] = useState<any>();
	const [orders, setOrders] = useState<any[]>([]);

	useEffect(() => {
		setLoading(false);
	}, [user]);

	useEffect(() => {
		if (!loading && user?.username != username) navigate("/");
	}, [loading]);

	useEffect(() => {
		if (user?.username && !["active", "delivered", "completed", "cancelled", "all", undefined].includes(id)) api.get(`order/${id}`).then(res => {
			if (res.data.customerId != user.id) {
				if (res.data.package.gig.ownerId == user.id) navigate(`/orders/${res.data.id}`);
				else navigate(`/users/${user.username}/orders`);
			}
			else setOrder(res.data);
		}).catch(() => navigate(`/users/${user.username}/orders`));
	}, [user, id]);

	useEffect(() => {
		if (user?.id && !order) api.get(`order?customerId=${user?.id}`).then(async res => setOrders(res.data));
	}, [user, order, id]);

	const handleNavigate = (order: any) => {
		navigate(`/users/${user?.username}/orders/${order.id}`, { replace: true });
		api.get(`order/${order.id}`).then(res => setOrder(res.data));
	}

	useEffect(() => {
		if (order && ["active", "delivered", "completed", "cancelled", "all", undefined].includes(id)) setOrder(null);
	}, [order, id]);

	const filter = (o: any) => {
		if (id == "active") return o.status == 0;
		else if (id == "delivered") return o.status == 1;
		else if (id == "completed") return o.status == 2;
		else if (id == "cancelled") return o.status == 3;
		else if (id == "all") return true;
		else if (!id) return o.status == 0;
	}

	return <>
		<CustomerNav />
		<div className="container mx-auto pt-28">
			{order && <Order order={order} setOrder={setOrder} />}
			{!order && <div className="mx-4 lg:mx-24 pt-20">
				<h1 className="text-4xl text-gray-700"> Manage Orders </h1>
				<section className="flex mt-6 uppercase text-[0.92rem] text-gray-400">
					<Tab tab="active" orders={orders?.filter(o => o.status == 0)} />
					<Tab tab="delivered" orders={orders?.filter(o => o.status == 1)} />
					<Tab tab="completed" orders={orders?.filter(o => o.status == 2)} />
					<Tab tab="cancelled" orders={orders?.filter(o => o.status == 3)} />
					<Tab tab="all" orders={orders} />
				</section>
				<section className="mt-8 bg-white border border-gray-200">
					<h1 className="uppercase ml-6 py-3 text-[0.93rem] font-semibold text-gray-800">{id ? id : "Active"} Orders</h1>
					<table className="w-full">
						<thead>
							<tr className="uppercase text-[0.82rem] font-semibold text-gray-400 border-t border-b border-gray-200">
								<td className="w-[50%]"></td>
								<td className="w-[15%] py-2">Order date</td>
								<td className="w-[15%]">Due on</td>
								<td className="w-[15%]">Total</td>
							</tr>
						</thead>
						<tbody>
							{orders?.filter(filter).length > 0 && orders?.filter(filter).map((order: any, index) => {
								const createdDate = new Date(order.createdAt);
								const deliveryDate = new Date(createdDate);
								deliveryDate.setDate(createdDate.getDate() + order.deliveryDays);

								return <tr key={order.id} onClick={() => handleNavigate(order)} className={`group text-[0.95rem] text-gray-600 items-center hover:bg-gray-50 cursor-pointer ${index != orders.filter(filter).length - 1 ? "border-b border-gray-200" : ""}`}>
									<td className="group-hover:text-blue-600 py-4 pl-6">{order.package.gig.title}</td>
									<td>{createdDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
									<td>{deliveryDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
									<td>{user?.currency} {commaNumber((order.price * order.quantity).toFixed(2))}</td>
								</tr>
							})}
						</tbody>
					</table>
					{orders.filter(filter).length == 0 && <div className="py-3 text-sm ml-4 text-gray-600">No {id != "all" ? id : ""} orders to show</div>}
				</section>
			</div>}
		</div>
		{/* Better if this is done in desktop mode */}
		<div style={{ backgroundImage: "url(/mobilebg.jpeg)" }} className="h-screen bg-no-repeat bg-cover bg-bottom lg:hidden flex items-center justify-center text-center z-[100]">
			<article className="mx-2">
				<h1 className="text-5xl font-bold text-red-500 drop-shadow-sm"> Entrelah </h1>
				<p className="text-xl font-semibold text-gray-700 mt-6 drop-shadow-sm"> We suggest viewing the desktop version of this page </p>
			</article>
		</div>
	</>
}

interface TabProps {
	tab: string;
	orders: any[];
}
function Tab(props: TabProps) {
	const user = useUser();
	const navigate = useNavigate();
	const { id } = useParams();

	const handleClick = () => navigate(`/users/${user?.username}/orders/${props.tab}`);

	return (
		<div className="flex mr-6 cursor-pointer group" onClick={handleClick}>
			<p className={`${(props.tab == id || (props.tab == "active" && !id)) ? "text-black" : "group-hover:text-black"}`}> {props.tab} </p>
			{props.orders?.length > 0 &&	
				<div className={`ml-2 bg-[#c5c6c9] text-white px-2 rounded-l-full rounded-r-full text-sm flex justify-between items-center mr-1 ${(props.tab == id || (props.tab == "active" && !id)) ? "bg-green-500" : "group-hover:bg-green-500"}`}>
					{props.orders?.length}
				</div>}
		</div>
	)
}