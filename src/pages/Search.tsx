import CustomerNav from "@components/CustomerNav/CustomerNav";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "@api";
import { BiHomeAlt } from "react-icons/bi";
import commaNumber from "comma-number";
import { Buffer } from "buffer";
import { useUser } from "@contexts/UserContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";

export function Search() {
	const user = useUser();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { category: categoryName, subcategory: subcategoryName } = useParams();
	const query = searchParams.get("query");
	const page = parseInt(searchParams.get("page") ?? "1");

	const [category, setCategory] = useState<any>();
	const [gigs, setGigs] = useState<any>();
	useEffect(() => {
		if (!categoryName) {
			if (!query) return navigate("/");
			api.get(`gig/search/${query}?page=${page}`).then(res => setGigs(res.data));
		}
		else {
			api.get(`category/name/${categoryName}`).then(async res => {
				setCategory(res.data);
				const response = await api.get(`gig/category/${categoryName}/${subcategoryName}?page=${page}`);
				setGigs(response.data);
			}).catch((e) => console.log(e));

		}
	}, [user, searchParams, categoryName, subcategoryName]);

	useEffect(() => {
		document.body.style.backgroundColor = "white";
		return () => { document.body.style.backgroundColor = "#f0f2f5" }
	}, []);

	return (
		<>
			<CustomerNav />
			<div className="pt-28 container mx-auto">
				{!categoryName && !gigs?.totalCount && <div className="pt-40 flex justify-center">
					<div className="flex justify-center flex-col text-center items-center">
						<img src="/empty-search-results.webp" className="min-h-[2rem] max-h-[14rem] w-fit" alt="cannotfind" />
						<h1 className="text-xl md:text-3xl text-gray-600 font-semibold mt-4">No Services Found For Your Search</h1>
						<p className="mt-2 text-gray-500 text-lg md:text-xl">I can't find anything with <span className="font-bold">{query}</span><br />Try searching for something else.</p>
					</div>
				</div>}
				{(categoryName || (query && gigs?.totalCount > 0)) && <div className="pt-6 mx-4">
					{categoryName && !subcategoryName &&
						<div className="mb-8">
							<h1 className="text-xl xl:text-2xl mb-4 mt-2">Categories in {categoryName}</h1>
							<Swiper
								slidesPerView={1}
								spaceBetween={30}
								breakpoints={{
									650: { slidesPerView: 2 },
									720: { slidesPerView: 3 },
									1025: { slidesPerView: 4 },
									1209: { slidesPerView: 5 },
									1629: { slidesPerView: 7 }
								}}>
								{category?.subcategories.map((c: any) => {
									return <SwiperSlide key={c.name} className="group">
										<Link to={c.name} className="py-3 px-4 shadow-md rounded-lg bg-white border flex justify-between items-center text-left">
											<p className="font-semibold text-gray-800 text-[1.05rem] group-hover:text-red-500">{c.name}</p>
											<FaChevronRight className="text-gray-600 group-hover:text-red-500" size={14} />
										</Link>
									</SwiperSlide>
								})}
							</Swiper>
						</div>}
					{categoryName && subcategoryName && <div className="flex items-center pt-6">
						<Link to="/" className="hover:bg-gray-100 p-2 rounded-full"> <BiHomeAlt size={14} className="text-gray-800" /> </Link>
						<p className="text-gray-400 mx-3">/</p>
						<Link className="text-[0.9rem] text-gray-600 font-[600] hover:underline underline-offset-2" to={`/categories/${categoryName}`}>{categoryName}</Link>
					</div>}
					{categoryName && <h1 className="text-[2rem] font-[600] mt-4 mb-2">{subcategoryName ?? categoryName}</h1>}
					{!categoryName && <h1 className="text-[1.85rem] font-[400] mt-4 mb-2">Results for <span className="font-bold">{query}</span></h1>}
					<div className="flex justify-between items-center">
						<p className="text-gray-500 text-[1.05rem]">{commaNumber(gigs?.totalCount)} service{gigs?.totalCount == 1 ? "" : "s"} available</p>
					</div>
					{/* Gigs to display */}
					{gigs?.gigs.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-3 gap-y-12 lg:gap-x-8 mt-8  x">
						{gigs.gigs.map((gig: any) => {
							console.log(gig.owner.avatar);
							const [attachment] = gig.attachments;
							return <div key={gig.id}>
								<Link to={`/users/${gig.owner.username}/${gig.id}`} target="_blank" className="cursor-pointer">
									{/* Gig Image */}
									{!attachment && <div className="bg-[#eeeeee] relative h-80 md:h-52 sm:h-44 items-center flex rounded-lg shadow-md">
										<img src="/gigplaceholder.webp" alt="gigimg" className="h-24 mx-auto overflow-clip" />
									</div>}
									{attachment && <img
										src={URL.createObjectURL(new File([new Uint8Array(Buffer.from(attachment.attachment.data).buffer)], attachment.attachment.filename, { type: attachment.attachment.contentType }))}
										alt={attachment.attachment.filename}
										className="h-80 w-full sm:h-44 md:h-52 rounded-lg shadow-md"
									/>}
								</Link>
								<div className="flex justify-between items-center">
									<Link to={`/users/${gig.owner.username}?public=true`} target="_blank" className="mt-4 mb-3 hover:underline cursor-pointer underline-offset-2 flex items-center">
										<img src={gig.owner.avatar?.data ? URL.createObjectURL(new File([new Uint8Array(Buffer.from(gig.owner.avatar.data).buffer)], gig.owner.avatar.filename, { type: gig.owner.avatar.contentType })) : "/placeholder.webp"} alt="profile" className="rounded-full w-6 h-6 mr-2" />
										<p className="text-[0.92rem] font-bold">{gig.owner.username}</p>
									</Link>
								</div>
								<Link className="hover:underline underline-offset-2 cursor-pointer text-gray-800" to={`/users/${gig.owner.username}/${gig.id}`}>I will {gig.title}</Link>
								<p className="font-semibold text-[1.02rem] mt-2">From {user?.currency ?? "USD"} {commaNumber(gig.packages[0].price)}</p>
							</div>
						})}
					</div>}
					{gigs?.gigs.length == 0 && <div className="pt-20 flex justify-center">
						<div className="flex justify-center flex-col text-center items-center">
							<img src="/empty-search-results.webp" className="min-h-[2rem] max-h-[14rem] w-fit" alt="cannotfind" />
							<h1 className="text-xl md:text-3xl text-gray-600 font-semibold mt-4">No Services Found</h1>
							<p className="mt-2 text-gray-500 text-lg md:text-xl">Looks like there aren't any available services under {subcategoryName ?? categoryName}.</p>
						</div>
					</div>}
					{/* Pagination */}
					{gigs?.totalPages > 1 && <div className="flex justify-center items-center">
						<button disabled={page == 1} onClick={() => navigate(`?page=${page - 1}`)} className={`mr-4 border border-gray-200 rounded-full p-2 ${page == 1 ? "bg-gray-100" : "hover:bg-gray-100"}`}>
							<FaChevronLeft size={12} className="text-gray-400" />
						</button>
						{Array.from(Array(gigs?.totalPages), (_, i) => <Link key={i} to={`?page=${i + 1}`} className={`text-gray-700 font-semibold text-[1.1rem] mx-1 underline-offset-8 p-2 ${((!page && i == 0) || page == i + 1) ? "underline" : "hover:underline"}`}>{i + 1}</Link>)}
						<button disabled={page == gigs?.totalPages} onClick={() => navigate(`?page=${String(page + 1)}`)} className={`ml-4 border border-gray-200 rounded-full p-2 ${page == gigs?.totalPages ? "bg-gray-100" : "hover:bg-gray-100"}`}>
							<FaChevronRight size={12} className="text-gray-400" />
						</button>
					</div>}
				</div>}
			</div>
		</>
	)
}