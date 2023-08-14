import { SellerNav } from "@components/SellerNav/SellerNav";
import { ReactNode } from 'react';
import { FaChevronRight, FaCheck} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { GigOverview } from "./GigOverview";
import { useUser } from "@/contexts/UserContext";
import { GigPricing } from "./GigPricing";

const tabs = ["overview", "pricing", "description", "gallery", "publish"];
export function GigBuilder() {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const tab = queryParams.get("tab") as string;
	const id = queryParams.get("id") as string;

	return (
		<>
			<SellerNav />
			<section className="top-20 bg-white w-full border-t border-b shadow-md hidden lg:block fixed">
				<div className="container mx-auto py-4 flex">
					<div className="mx-8 flex justify-between w-full">
						{/* Stages */}
						<ul className="flex">
							<Tab gigId={id} index={0} currentIndex={tabs.indexOf(tab)}> Overview </Tab>
							<Tab gigId={id} index={1} currentIndex={tabs.indexOf(tab)}> Pricing </Tab>
							<Tab gigId={id} index={2} currentIndex={tabs.indexOf(tab)}> Description & FAQ </Tab>
							<Tab gigId={id} index={3} currentIndex={tabs.indexOf(tab)}> Gallery </Tab>
							<Tab gigId={id} index={4} currentIndex={tabs.indexOf(tab)} final> Publish </Tab>
						</ul>
						{/* Buttons */}
						<div>
							<button> Save </button>
							<button> Save & Preview </button>
						</div>
					</div>
				</div>
			</section>
			<div>
				{/* Better if this is done in desktop mode */}
				<div style={{ backgroundImage: "url(/mobilebg.jpeg)" }} className="h-screen bg-no-repeat bg-cover bg-bottom lg:hidden flex items-center justify-center text-center">
					<article className="mx-2">
						<h1 className="text-5xl font-bold text-red-500 drop-shadow-sm"> Entrelah </h1>
						<p className="text-xl font-semibold text-gray-700 mt-6 drop-shadow-sm"> We suggest viewing the desktop version of this page </p>
					</article>
				</div>
				{/* Now for the actual stuff */}
				<div className="hidden lg:block pt-36 container mx-auto">
					<div className="mt-16 mx-16 2xl:mx-56">
						{tab == "overview" && <GigOverview />}
						{tab == "pricing" && <GigPricing />}
					</div>
				</div>
			</div>
		</>
	)
}

interface TabProps {
	index: number;
	currentIndex: number;
	children: ReactNode;
	gigId: string;
	final?: boolean;
}
function Tab(props: TabProps) {
	const user = useUser();
	const navigate = useNavigate();
	function handleClick() {
		if (props.index >= props.currentIndex) return;
		navigate(`/users/${user?.username}/manage_gigs/edit?tab=${tabs[props.index]}&id=${props.gigId}`);
	}

	return (
		<li className="flex items-center">
			<div className="flex cursor-pointer" onClick={handleClick}>
				<div className={`w-6 h-6 font-bold text-white flex items-center justify-center rounded-full mr-2 ${props.currentIndex >= props.index ? "bg-green-500" : "bg-gray-300"}`}>
					{props.currentIndex > props.index ? <FaCheck size={14} /> : props.index + 1}
				</div>
				<header className={`font-semibold ${props.currentIndex >= props.index ? props.currentIndex == props.index ? "text-gray-600" : "text-green-500" : "text-gray-400"}`}> {props.children} </header>
			</div>
			{!props.final && <FaChevronRight size={12} className="text-gray-500 mx-4" />}
		</li>
	);
}