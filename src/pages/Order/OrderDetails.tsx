import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '@api';
import { useUser } from '@contexts/UserContext';
import commaNumber from 'comma-number';

interface OrderDetailProps {
	order?: any;
	className?: string;
}
export function OrderDetails(props: OrderDetailProps) {
	const { id } = useParams();
	const [order, setOrder] = useState<any>(null);
	const user = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (props.order) setOrder(props.order);
		else api.get(`order/${id}`).then(res => setOrder(res.data)).catch(() => navigate("/"));
	}, []);

	return (
		<div className={`bg-white pb-10 ${props.className} px-10`}>
			<header>
				<div className="flex justify-between">
					{/* Title */}
					<div>
						<h1 className="text-[1.3rem] font-semibold"> I will {order?.package.gig.title} </h1>
						<div className="mt-2 sm:flex block">
							<p className="text-gray-500 text-[1.05rem]"> Ordered by <Link to={`/users/${order?.customer.username}`} className="underline text-red-500"> {order?.customer.username} </Link> </p>
							<div className="border-l mx-3 hidden sm:block" />
							<p className="text-gray-500 text-[1.05rem]"> Date ordered <span className="font-semibold text-gray-600"> {formatDate(new Date(order?.createdAt))} </span> </p>
						</div>
					</div>
					{/* Price */}
					<div className="text-right">
						<p className="font-bold text-[0.95rem] text-gray-700"> Total price </p>
						<h2 className="text-lg font-bold text-gray-700"> {user?.currency} {commaNumber((order?.price * order?.quantity).toFixed(2))} </h2>
					</div>
				</div>
				<hr className="my-2" />
				<p className="text-gray-500 text-[1.05rem]"> Order number <span className="text-gray-600 font-semibold"> #{order?.id} </span> </p>
				<hr className="mt-2 mb-4" />
				<p className="text-gray-500 text-[1.05rem]"> {order?.title} </p>
				<table className="border w-full mt-4">
					<thead>
						<tr className="bg-[#f5f5f5] border-b">
							<td className="font-bold text-gray-600 text-sm py-3 pl-6"> Item </td>
							<td className="text-right font-bold text-gray-600 text-sm"> Qty. </td>
							<td className="text-right font-bold text-gray-600 text-sm"> Duration </td>
							<td className="text-right font-bold text-gray-600 text-sm pr-6"> Price </td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className="pl-6 text-[0.85rem] max-w-[6rem] py-3">
								<h1 className="font-bold text-gray-600"> {order?.title} </h1>
								<p className="text-gray-700"> {order?.description} </p>
								<ul className="list-disc list-inside pl-3 mt-1 text-gray-700">
									{![null, 0].includes(order?.revisions) && <li> {order?.revisions == -1 ? "Unlimited" : order?.revisions} revision{order?.revisions == 1 ? "" : "s"} </li>}
								</ul>
							</td>
							<td className="text-right text-[0.85rem] align-top pt-3"> {order?.quantity} </td>
							<td className="text-right text-[0.85rem] align-top pt-3"> {order?.deliveryDays} day{order?.deliveryDays == 1 ? "" : "s"} </td>
							<td className="text-right text-[0.85rem] align-top pt-3 pr-6"> {user?.currency} {commaNumber((order?.price * order?.quantity).toFixed(2))} </td>
						</tr>
					</tbody>
					<tfoot>
						<tr className="bg-[#f5f5f5] border-t">
							<td className="font-bold text-gray-600 text-sm py-3 pl-6" colSpan={3}> Total </td>
							<td className="text-right font-bold text-gray-600 text-sm pr-6"> {user?.currency} {commaNumber((order?.price * order?.quantity).toFixed(2))} </td>
						</tr>
					</tfoot>
				</table>
			</header>
		</div>
	)
}

const formatDate = (date: Date) => {
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const month = months[date.getMonth()];
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	return `${month} ${day}, ${hours}:${minutes}`;
}