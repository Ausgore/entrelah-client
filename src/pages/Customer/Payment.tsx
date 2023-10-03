import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { FaCheck, FaQuestionCircle } from "react-icons/fa";
import api from '@api';
import { useUser } from "@contexts/UserContext";
import { Buffer } from "buffer";
import commaNumber from "comma-number";
import { CheckoutForm } from "@components/CheckoutForm";
import { StripeWrapper } from "@components/StripeWrapper";

export function Payment() {
	useEffect(() => {
		document.body.style.backgroundColor = "white";
		return () => {
			document.body.style.backgroundColor = "#f0f2f5";
		}
	}, []);

	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const tab = queryParams.get("tab") as string;
	const quantity = queryParams.get("quantity") as string;
	const { id } = useParams();
	const defUser = useUser();

	const [user, setUser] = useState<any>(null);
	const [pkg, setPackage] = useState<any>(null);
	useEffect(() => {
		api.get(`user/${defUser?.id}`).then(res => setUser(res.data));
		api.get(`package/${id}`).then(res => setPackage(res.data));
	}, [id]);

	const [serviceFee, setServiceFee] = useState<number | null>(null);
	useEffect(() => {
		if (pkg) {
			const serviceFee = (parseInt(pkg.price) * parseInt(quantity ?? 1)) * (5.5 / 100);
			setServiceFee(Math.round(serviceFee * 100) / 100);
		}
	}, [pkg])

	const [attachment, setAttachment] = useState<any>(null);
	useEffect(() => {
		if (pkg) api.get(`gig/${pkg.gig.id}/attachments?first=true`).then(res => setAttachment(res.data));
	}, [pkg]);

	const [displayServiceFeeInfo, setDisplayServiceFeeInfo] = useState(false);

	const buttonRef = useRef<HTMLButtonElement>(null);
	const submitRef = useRef<HTMLButtonElement>(null);
	const handleSubmitClick = () => submitRef.current?.click();

	return (
		<>
			{/* Navigation */}
			<nav className="bg-white w-full px-6 border-b p-5 border-b-gray-300">
				<div className="container mx-auto flex">
					<Link to="/" className="text-2xl lg:text-3xl font-bold text-red-500 "> Entrelah </Link>
					<ul className="ml-12 hidden md:flex">
						{/* Order details */}
						<li className="flex items-center">
							<div className="flex items-center">
								<div className="w-6 h-6 font-bold text-white flex items-center justify-center rounded-full bg-[#232323] mr-3">
									<FaCheck className="py-[0.13rem]" />
								</div>
								<Link to={`/users/${pkg?.gig.owner.username}/${pkg?.gig.id}`} className="text-[1.05rem] font-semibold text-gray-800 cursor-pointer hover:underline underline-offset-4"> Order Details </Link>
							</div>
						</li>
						{/* Confirm & Pay */}
						<li className="flex items-center">
							<FiChevronRight className="text-gray-600 mx-4" />
							<div className="flex items-center">
								<div className="w-6 h-6 font-bold text-white flex items-center justify-center rounded-full bg-[#232323] mr-3">
									{tab == "confirm" && <span> 2 </span>}
									{tab != "confirm" && <FaCheck className="py-[0.13rem]" />}
								</div>
								<span className="text-[1.05rem] font-semibold text-gray-800"> Confirm & Pay </span>
							</div>
						</li>
					</ul>
				</div>
			</nav>
			{/* Main */}
			<div className="container mx-auto lg:flex block flex-row justify-between relative mt-8">
				{/* Left */}
				<div className="w-full lg:w-8/12 mx-4 xl:mr-24">
					{/* Billing Information */}
					<section className="border border-gray-200 mb-6">
						<header className="bg-[#fafafa] py-3 px-5 text-[1.05rem] border-b border-gray-200 font-semibold text-gray-800"> Billing Information </header>
						<div className="px-5 w-[32rem] my-4">
							<div className="flex justify-between mb-3">
								<p className="text-gray-600 text-[1.05rem]"> Your invoice will be issued according to the details listed here. </p>
							</div>
							<div className="flex flex-col">
								<span className="font-semibold text-gray-600"> {defUser?.username} </span>
								<span className="text-gray-700"> {user?.location ?? "Singapore"} </span>
							</div>
						</div>
					</section>
					{/* Payment Options */}
					<section className="border border-gray-200">
						<header className="bg-[#fafafa] py-3 px-5 text-[1.05rem] border-b border-gray-200 font-semibold text-gray-800"> Payment Options </header>
						{serviceFee && <StripeWrapper amount={(parseInt(pkg.price) * parseInt(quantity ?? 1)) + serviceFee}>
							<CheckoutForm submitRef={submitRef} buttonRef={buttonRef} package={pkg} />
						</StripeWrapper>}
					</section>
				</div>
				{/* Right */}
				<div className="w-full lg:w-4/12 lg:my-0 my-8 mx-4">
					<div className="border border-gray-200">
						<section className="bg-[#fafafa] px-6">
							{/* Gig Title and Image */}
							<article className="py-4 flex ">
								{attachment && <img
									src={URL.createObjectURL(new File([new Uint8Array(Buffer.from(attachment.attachment.data).buffer)], attachment.attachment.filename, { type: attachment.attachment.contentType }))}
									alt={attachment.attachment.filename}
									className={`w-[7rem] rounded-md`}
								/>}
								<h1 className="font-semibold text-[1.05rem] text-gray-500 ml-4 leading-[1.2rem]"> I will {pkg?.gig.title} </h1>
							</article>
							<hr />
							{/* Package Information */}
							<article className="py-4">
								<header className="xl:flex justify-between items-center">
									<h1 className="font-semibold text-gray-500 text-[1.02rem]"> {pkg?.title} </h1>
									<span className="text-gray-500"> {user?.currency} {commaNumber((parseInt(pkg?.price) * parseInt(quantity ?? 1)).toFixed(2))} </span>
								</header>
								<div className="mt-3 mb-1">
									{pkg && pkg.revisions != 0 && <div className="flex items-center"> <FaCheck className="p-[0.1rem] text-gray-600" /> <span className="ml-3 text-gray-500"> {pkg.revisions == -1 ? "Unlimited" : pkg.revisions} revision{pkg.revisions > 1 ? "s" : pkg.revisions < 0 ? "s" : ""} </span> </div>}
								</div>
							</article>
						</section>
						<hr />
						<section className="px-6">
							{/* Service fee */}
							<article className="flex justify-between py-3">
								<div className="flex relative items-center">
									<span className="text-[1.05rem] text-gray-500 mr-3"> Service fee </span>
									<FaQuestionCircle className="text-gray-400" size={14} onMouseOver={() => setDisplayServiceFeeInfo(true)} onMouseLeave={() => setDisplayServiceFeeInfo(false)} />
									{displayServiceFeeInfo && <p className="absolute w-[20rem] rounded-md -top-16 -left-1/2 mt-1 px-4 py-2 text-center text-white bg-[#404145] text-sm">
										This helps us operate our platform and offer 24/7 customer support for your orders.
									</p>}
								</div>
								<div className="text-gray-500"> {user?.currency} {commaNumber((serviceFee as number)?.toFixed(2))} </div>
							</article>
							<hr />
							{/* Total */}
							<article className="py-4">
								<div className="flex justify-between">
									<h1 className="text-lg font-bold text-gray-600"> Total </h1>
									{serviceFee && <h2 className="text-lg font-bold text-gray-600"> {user?.currency} {commaNumber(((parseInt(pkg?.price) * parseInt(quantity ?? 1) + serviceFee)).toFixed(2))} </h2>}
								</div>
								<div className="flex justify-between mt-2">
									<p className="text-[1.05rem] text-gray-500 mr-3"> Total delivery time </p>
									<p className="text-gray-500"> {pkg?.deliveryDays} day{pkg?.deliveryDays > 1 ? "s" : ""} </p>
								</div>
								<footer className="mt-4">
									<button className="bg-black hover:bg-[#404145] text-white font-semibold text-[1.05rem] tracking-tight py-3 rounded-md relative px-6 mb-1 w-full" onClick={handleSubmitClick} ref={buttonRef}>
										Confirm & Pay
									</button>
									{serviceFee && <p className="text-gray-500 text-sm text-center mt-2">
										You will be charged {user?.currency} {commaNumber(((parseInt(pkg?.price) * parseInt(quantity ?? 1) + serviceFee)).toFixed(2))}. Total amount includes currency conversion fees. 
									</p>}
								</footer>
							</article>
						</section>
					</div>
				</div>
			</div>
		</>
	)
}