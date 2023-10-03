import { SellerNav } from "@components/SellerNav/SellerNav";
import { useUser } from "@contexts/UserContext";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import api from "@api";
import { useNavigate, Link } from "react-router-dom";
import { BsCaretDownFill } from "react-icons/bs";

export function ManageGigs() {
	const user = useUser();
	const [gigs, setGigs] = useState<any[]>([]);

	const queryParams = new URLSearchParams(location.search);
	const [type, setType] = useState<string>(queryParams.get("type") as string);

	useEffect(() => {
		if (user?.id) api.get(`gig?ownerId=${user?.id}`).then(res => setGigs(res.data));
	}, [user]);

	const filter = (g: any) => {
		if (type == "active" || !type) return g.status == 1;
		else if (type == "draft") return g.status == 0;
		else if (type == "paused") return g.status == 2;
	}

	return (
		<>
			<SellerNav />
			<div className="container mx-auto pt-28">
				<div className="mx-4 lg:mx-24">
					<h1 className="text-4xl text-gray-700"> Manage Gigs </h1>
					<section className="flex mt-6 uppercase text-[0.92rem] text-gray-400">
						<Tab setType={setType} tab="active" gigs={gigs?.filter(g => g.status == 1)} />
						<Tab setType={setType} tab="draft" gigs={gigs?.filter(g => g.status == 0)} />
						<Tab setType={setType} tab="paused" gigs={gigs?.filter(g => g.status == 2)} />
					</section>
					<section className="mt-8 bg-white border border-gray-200">
						<h1 className="uppercase ml-6 py-3 text-[0.93rem] font-semibold text-gray-800"> {type ?? "Active"} Gigs </h1>
						<table className="w-full">
							<thead>
								<tr className="uppercase text-[0.82rem] font-semibold text-gray-400 border-t border-b border-gray-200">
									<td className="pl-1"></td>
									<td className="py-2">Gig</td>
									<td>Impressions</td>
									<td>Clicks</td>
									<td>Orders</td>
									<td colSpan={2}>Cancellations</td>
								</tr>
							</thead>
							<tbody>
								{gigs.filter(filter).length > 0 && gigs?.filter(filter).map((gig: any, index) => <GigRow key={gig.id} gig={gig} index={index} gigs={gigs} filter={filter} setGigs={setGigs} />)}
							</tbody>
						</table>
						{gigs.filter(filter).length == 0 && <div className="py-3 text-sm ml-4 text-gray-600">No {type} gigs to show</div>}
					</section>
				</div>
			</div>
		</>
	)
}

interface TabProps {
	tab: string;
	gigs: any[];
	setType: Dispatch<SetStateAction<string>>;
}
function Tab(props: TabProps) {
	const navigate = useNavigate();
	const queryParmas = new URLSearchParams(location.search);
	const type = queryParmas.get("type") as string;

	const handleClick = () => {
		navigate(`?type=${props.tab}`);
		props.setType(props.tab);
	}

	return (
		<div className="flex mr-6 cursor-pointer group" onClick={handleClick}>
			<p className={`${props.tab == type ? "text-black" : "group-hover:text-black"}`}> {props.tab} </p>
			{props.gigs?.length > 0 &&
				<div className={`ml-2 bg-[#c5c6c9] text-white px-2 rounded-l-full rounded-r-full text-sm flex justify-between items-center mr-1 ${props.tab == type ? "bg-green-500" : "group-hover:bg-green-500"}`}>
					{props.gigs?.length}
				</div>}
		</div>
	)
}

interface GigRowProps {
	gig: any;
	index: number;
	gigs: any[];
	setGigs: Dispatch<SetStateAction<any[]>>;
	filter: (gig: any) => boolean | undefined;
}
function GigRow(props: GigRowProps) {
	const user = useUser();
	const ref = useRef<HTMLDivElement>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	
	useEffect(function () {
		function handleOutsideClick(event: globalThis.MouseEvent) {
			if (ref.current && event.target instanceof Node && ref.current.contains(event.target)) return;
			setMenuOpen(false);
		}
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

	const handlePause = async () => {
		await api.post(`gig/edit/${props.gig.id}`, { status: 2 });
		const response = await api.get(`gig?ownerId=${user?.id}`);
		props.setGigs(response.data);
	}

	const handleActivate = async () => {
		await api.post(`gig/edit/${props.gig.id}`, { status: 1 });
		const response = await api.get(`gig?ownerId=${user?.id}`);
		props.setGigs(response.data);
	}

	const handleDelete = async () => {
		await api.delete(`gig/delete/${props.gig.id}`);
		const response = await api.get(`gig?ownerId=${user?.id}`);
		props.setGigs(response.data);
	}

	return <tr className={`text-[0.95rem] text-gray-600 items-center hover:bg-gray-50 ${props.index != props.gigs.filter(props.filter).length - 1 ? "border-b border-gray-200" : ""}`}>
		<td></td>
		<td className="py-4">{props.gig.title}</td>
		<td>{props.gig.impressions ?? 0}</td>
		<td>{props.gig.clicks ?? 0}</td>
		<td>{props.gig.packages.reduce((a: number, p: any) => a + p.orders.filter((o: any) => o.status != 3).length, 0)}</td>
		<td>{props.gig.packages.reduce((a: number, p: any) => a + p.orders.length, 0) && (props.gig.packages.reduce((a: number, p: any) => a + p.orders.filter((o: any) => o.status == 3).length, 0) / props.gig.packages.reduce((a: number, p: any) => a + p.orders.length, 0)) * 100}%</td>
		<td className="flex justify-end mr-4 py-4">
			<div className="border border-gray-200 p-2 relative w-fit cursor-pointer" ref={ref} onClick={() => setMenuOpen(true)}>
				<BsCaretDownFill size={8} className="text-gray-400" />
				{menuOpen && <div className="absolute bg-white shadow-lg -top-1 -right-1 border w-32 border-gray-300 flex flex-col py-1">
					<Link to={`/users/${user?.username}/${props.gig.id}`} className="text-sm uppercase text-gray-600 px-2 py-1 hover:text-red-500">Preview</Link>
					<Link to={`/users/${user?.username}/manage_gigs/edit?tab=overview&id=${props.gig.id}`} className="text-sm uppercase text-gray-600 px-2 py-1 hover:text-red-500">Edit</Link>
					{props.gig.status == 1 && <button className="text-sm uppercase text-gray-600 px-2 py-1 hover:text-red-500 text-left" onClick={handlePause}>Pause</button>}
					{props.gig.status == 2 && <button className="text-sm uppercase text-gray-600 px-2 py-1 hover:text-red-500 text-left" onClick={handleActivate}>Activate</button>}
					<button className="text-sm uppercase text-gray-600 px-2 py-1 hover:text-red-500 text-left" onClick={handleDelete}>Delete</button>
				</div>}
			</div>
		</td>
	</tr>
}