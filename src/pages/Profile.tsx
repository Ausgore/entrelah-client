import CustomerNav from "@components/CustomerNav/CustomerNav";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "@api";
import { useState, useEffect, FormEvent, useRef } from "react";
import { useUser } from "@contexts/UserContext";
import { MdLocationOn } from "react-icons/md";
import { BiSolidUser } from "react-icons/bi";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import ms from "ms";

export default function Profile() {
	const { username } = useParams();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const isPublic = queryParams.get("public");

	const [viewedUser, setViewedUser] = useState<any>(null);
	const user = useUser();
	const navigate = useNavigate();

	useEffect(function () {
		api.get(`user?username=${username}`).then(function (response) {
			if (!response.data[0]) return navigate("/404");
			if (response.data[0].id == user?.id) navigate(`/${response.data[0].username}?public=true`);
			const [data] = response.data;
			setViewedUser(data);
			setDescription(data.description);
			setBio(data.bio);
		});
	}, []);

	// Edit Bio
	const bioRef = useRef<HTMLTextAreaElement>(null);
	const [bio, setBio] = useState("");
	function updateBio() {
		if (viewedUser?.bio != bioRef.current?.value) api.post(`user/update/${viewedUser?.id}`, { bio: bioRef.current?.value }).then(() => setBio(bioRef.current?.value as string));
	}
	function resizeBioArea() {
		if (bioRef.current) bioRef.current.style.height = `${bioRef.current.scrollHeight}px`;
	}
	// Need to look into this more, useLayoutEffect isn't working as intended
	useEffect(() => { setTimeout(() => resizeBioArea(), 50) }, []);
	// Edit Bio

	// Edit Description
	const descriptionRef = useRef<HTMLTextAreaElement>(null);
	const [description, setDescription] = useState("");
	const [isEditingDesc, setIsEditingDesc] = useState(false);
	const startEditingDescription = () => setIsEditingDesc(true);
	const stopEditingDescription = () => setIsEditingDesc(false);
	function updateDescription(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (viewedUser?.description != descriptionRef.current?.value) {
			api.post(`user/update/${viewedUser?.id}`, { description: descriptionRef.current?.value }).then(function () {
				setDescription(descriptionRef.current?.value as string);
				stopEditingDescription();
			});
		}
		else stopEditingDescription();
	}
	// Edit Description

	return (
		<>
			<CustomerNav />
			<div className="relative pb-12 pt-40">
				<div className="container mx-auto">
					<div className="grid grid-cols-12">
						{/* Profiles, Descriptions and so on */}
						<article className="col-span-full lg:col-span-4 relative mx-0 lg:mx-4">
							{/* Profile */}
							<section className="border bg-white shadow-md p-8">
								{/* Image */}
								<div className="flex justify-center"> <img src="placeholder.webp" alt="profile" className="rounded-full w-32" /> </div>
								{/* User Information */}
								<div className="text-center mt-4">
									{/* Display Name */}
									<h1 className="text-lg font-bold text-gray-700"> {viewedUser?.displayName ?? "DisplayName"} </h1>
									{/* Username */}
									<h2 className=" text-gray-500"> @{viewedUser?.username} </h2>
									{/* Bio */}
									{((isPublic && viewedUser?.bio) || !isPublic) && <div className="mt-1 mb-2">
										{isPublic && viewedUser?.bio && <h3 className="text-gray-600 text-[0.95rem]"> {bio} </h3>}
										{!isPublic && <textarea spellCheck="false" className="text-[0.95rem] text-gray-600 hover:underline underline-offset-2 text-center outline-none focus:text-gray-700 hover:text-gray-700 w-full placeholder:hover:underline resize-none overflow-hidden" placeholder="What's your story in one line?" maxLength={60} defaultValue={bio} onBlur={updateBio} ref={bioRef} onInput={resizeBioArea} />}
										{!isPublic && <button className="border font-semibold text-gray-600 tracking-wide border-gray-300 py-1 mb-4 rounded-md w-full lg:w-64 hover:bg-gray-500 hover:border-gray-500 hover:text-white shadow-md" onClick={() => navigate(`/${viewedUser?.username}?public=true`)}> Preview Public Profile </button>}
									</div>}
								</div>
								<hr className="mt-3" />
								{/* Other information */}
								<table className="mt-2 w-full text-gray-500">
									<tbody>
										<tr>
											<td className="pt-2 flex items-center"> <MdLocationOn className="mr-2" /> From </td>
											<td className="pt-2 text-right font-semibold"> {viewedUser?.location ?? "Singapore"} </td>
										</tr>
										<tr>
											<td className="pt-2 flex items-center"> <BiSolidUser className="mr-2" /> Member since </td>
											<td className="pt-2 text-right font-semibold"> {new Date(viewedUser?.createdAt).toLocaleDateString("default", { month: "long", year: "numeric" })} </td>
										</tr>
									</tbody>
								</table>
							</section>
							{/* Description */}
							<section className="border mt-8 bg-white shadow-md p-8">
								{((isPublic && viewedUser?.description) || !isPublic) && <article>
									{/* Header */}
									<header className="flex mb-4">
										<span className="font-semibold text-gray-600"> Description </span>
										{/* Edit only if not public */}
										{!isPublic && <button className="text-right w-full text-[#00699b]" onClick={startEditingDescription}> Edit Description </button>}
									</header>
									{/* Paragraph */}
									<div className="min-h-[2rem]">
										<p className={`text-gray-700 mt-2 text-sm ${isEditingDesc ? "hidden" : "block"}`}> {description} </p>
										<form className={isEditingDesc ? "block" : "hidden"} onSubmit={updateDescription}>
											<div className="bg-[#f4f4f4] w-full p-4">
												<textarea className="bg-[#f4f4f4] w-full pr-6 h-28 resize-none outline-none text-gray-600 text-sm" defaultValue={description} placeholder="Please tell us about any hobbies, additional expertise, or anything else you'd like to add." maxLength={600} ref={descriptionRef} />
												<hr />
												<div className="lg:flex justify-center mt-2 gap-4">
													{/* Cancel Button */}
													<button type="button" onClick={stopEditingDescription} className="bg-white border text-gray-500 font-semibold rounded-md w-full text-center py-2 shadow-md"> Cancel </button>
													{/* Update Button */}
													<button className="border text-white bg-[#1dbf73] font-semibold rounded-md w-full text-center py-2 mt-4 lg:mt-0 shadow-md"> Update </button>
												</div>
											</div>
										</form>
									</div>
								</article>}
							</section>
						</article>
						{/* Gigs, reviews, and so on */}
						<article className="col-span-full lg:col-span-8 lg:mx-8 h-max">
							{/* No gigs */}
							{!isPublic && <section className="border bg-white shadow-md p-8 hidden lg:block py-20 mb-8">
								<div className="flex justify-center"> <img src="profileBecomeSeller.webp" alt="profileBecomeSeller" className="w-56" /> </div>
								<div className="text-center mt-6">
									<h1 className="font-semibold text-xl text-gray-600 tracking-tight"> Ready to earn on your own terms? </h1>
									<button className="bg-red-500 py-2 text-lg px-8 rounded-md text-white font-semibold mt-4"> Become a seller </button>
								</div>
							</section>}
							{/* Has Reviews */}
							{(viewedUser?.reviewsReceived.length > 0) && <section className="border bg-white shadow-md p-8 mt-8 lg:mt-0">
								<SellerReviewsSection reviews={viewedUser?.reviewsReceived.filter((r: any) => r.reviewType == "seller")} />
								<BuyerReviewsSection reviews={viewedUser?.reviewsReceived.filter((r: any) => r.reviewType == "buyer")} />
							</section>}
						</article>
					</div>
				</div>
			</div>
		</>
	);
}

interface ReviewProps {
	review: any;
}

interface ReviewsProps {
	reviews: any[];
}

function SellerReviewsSection({ reviews }: ReviewsProps) {
	reviews = reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
	return (
		reviews.length > 0 && <section className="mb-8">
			<SellerReviewsHeader reviews={reviews} />
			<ul className="mt-6"> {reviews.map(r => <Review review={r} key={r.id} />)} </ul>
		</section>
	);
}
function BuyerReviewsSection({ reviews }: ReviewsProps) {
	reviews = reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	return (
		reviews.length > 0 && <section>
			<h1 className="text-gray-700 font-semibold text-lg mb-6"> Reviews as Buyer </h1>
			<ul> {reviews.map(r => <Review review={r} key={r.id} />)} </ul>
		</section>
	);
}

interface StarRatingProps {
	rating: number;
}
function DisplayStarRating({ rating }: StarRatingProps) {
	const stars: any[] = [];
	const fullStars = Math.floor(rating);
	const remainingStars = 5 - rating;
	for (let i = 0; i < fullStars; i++) stars.push(<BsStarFill className="mr-1" size={15} key={i} />);
	if ((Math.floor(remainingStars)) !== remainingStars) stars.push(<BsStarHalf className="mr-1" size={15} key={0.5} />);
	for (let i = 0 + fullStars; i < Math.floor(remainingStars) + fullStars; i++) stars.push(<BsStar className="mr-1" size={15} key={i} />);

	return <span className="flex pr-2 text-[#ffb33e] items-center"> {stars} <span className="ml-1 font-bold"> {rating.toFixed(1)} </span> </span>;
}

function SellerReviewsHeader({ reviews }: ReviewsProps) {
	const totalRatings = reviews.reduce((a, r) => a + ((r.communicationRating + r.accuracyRating + r.recommendationRating) / 3), 0);
	const avgRating = totalRatings / reviews.length;

	const totalCommRatings = reviews.map(r => r.communicationRating).reduce((a, r) => a + r);
	const avgCommRating = (totalCommRatings / reviews.length).toFixed(1);

	const totalReccRatings = reviews.map(r => r.recommendationRating).reduce((a, r) => a + r);
	const avgReccRating = (totalReccRatings / reviews.length).toFixed(1);

	const totalAccuracyRatings = reviews.map(r => r.accuracyRating).reduce((a, r) => a + r);
	const avgAccuracyRating = (totalAccuracyRatings / reviews.length).toFixed(1);

	return (
		<div>
			<div className="block sm:flex items-center">
				<h1 className="text-gray-700 font-semibold text-lg mr-0 sm:mr-6"> {reviews.length} review{reviews.length > 1 && "s"} as seller </h1>
				<DisplayStarRating rating={avgRating} />
			</div>
			<div className="mt-4">
				<hr className="my-2 block sm:hidden" />
				<table className="w-full">
					<caption className="font-semibold text-gray-700 text-lg text-left mb-3"> Rating Breakdown </caption>
					<tbody>
						<tr>
							<td className="text-gray-500 py-1"> Seller communication level </td>
							<td className="text-[#ffb33e] py-1 items-right flex justify-end items-center"> <BsStarFill className="mr-1" size={15} /> <span className="ml-1 font-bold"> {avgCommRating} </span> </td>
						</tr>
						<tr>
							<td className="text-gray-500 py-1"> Recommend to friend </td>
							<td className="text-[#ffb33e] items-right flex justify-end items-center"> <BsStarFill className="mr-1" size={15} /> <span className="ml-1 font-bold"> {avgReccRating} </span> </td>
						</tr>
						<tr>
							<td className="text-gray-500 py-1"> Service as described </td>
							<td className="text-[#ffb33e] items-right flex justify-end items-center"> <BsStarFill className="mr-1" size={15} /> <span className="ml-1 font-bold"> {avgAccuracyRating} </span> </td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}

function Review({ review }: ReviewProps) {
	const duration = Date.now() - new Date(review.createdAt).getTime();
	const rating = review.reviewType == "buyer" ? review.buyerRating : (review.communicationRating + review.accuracyRating + review.recommendationRating) / 3;

	return (
		<>
			<hr />
			<li className="py-4">
				{/* User info */}
				<div className="flex items-center">
					<img src="placeholder.webp" className="w-12 rounded-full" alt="profile" />
					<div className="block ml-4 items-center py-1">
						<span className="font-semibold text-gray-800 tracking-wide"> {review.reviewer.username} </span>
						<span className="flex text-sm tracking-wider text-[#62646a] items-center"> Singapore </span>
					</div>

				</div>
				{/* Review info */}
				<div className="ml-0 mt-2 sm:mt-0 sm:ml-16">
					{/* Stars */}
					<div className="block sm:flex items-center mt-3">
						<DisplayStarRating rating={rating} />
						<time className="text-[#62646a] tracking-wider text-sm border-l-0 sm:border-l pl-0 sm:pl-3 ml-0 sm:ml-1"> {duration < 60000 ? "Just now" : `${ms(duration, { long: true })} ago`} </time>
					</div>
					<p className="text-[#404145] mt-3 sm:mt-2"> {review.message} </p>
				</div>
			</li>
		</>
	)
}