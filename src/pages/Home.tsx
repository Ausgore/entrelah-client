import CustomerNav from '@/components/CustomerNav/CustomerNav';
import { AiOutlineSearch } from "react-icons/ai";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import "swiper/css";
import api from "@api";
import { useNavigate } from "react-router-dom";

export function Home() {
	const navigate = useNavigate();
	const [categories, setCategories] = useState<any[]>([]);
	useEffect(() => { 
		document.title = "Entrelah - Freelance Services Marketplace" 
		api.get("category").then(res => setCategories(res.data));
	}, []);

	const [inputValue, setInputValue] = useState("");
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	}
	const handleKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key == "Enter") handleSearch();
	}

	const handleSearch = () => {
		if (inputValue.length)	navigate(`/search?query=${inputValue}`);
	}

	return (
		<>
			<CustomerNav />
			<div className="pt-56 relative">
				{/* Hero Article */}
				<section className="container mx-auto">
					<div className="grid grid-cols-12 py-0 lg:py-6 my-6">
						{/* Text and Search */}
						<article className="col-span-full lg:col-span-6 lg:mx-6 relative">
							<h1 className="font-semibold text-gray-900 drop-shadow-sm mb-3 text-4xl xl:text-5xl text-center lg:text-left"> Find the Perfect Freelance Services for Your Business </h1>
							<h2 className="text-gray-900 drop-shadow-md text-xl text-center lg:text-left"> Millions of people use Entrelah to turn their ideas into reality </h2>
							{/* Search */}
							<div className="flex flex-col lg:flex-row justify-center lg:justify-normal mx-6 lg:mx-0 mt-8">
								<input type="text" value={inputValue} placeholder="Find Services..." className="w-full lg:w-[24rem] xl:w-[32rem] p-3 pl-6 rounded-md lg:rounded-none lg:rounded-l-md shadow-md outline-none" onChange={handleChange} onKeyDown={handleKeydown} />
								<button className="mt-6 lg:mt-0 p-3 flex justify-center bg-red-500 shadow-md rounded-md lg:rounded-none lg:rounded-r-md" onClick={handleSearch}> <AiOutlineSearch size={22} className="text-white" /> </button>
							</div>
						</article>
						{/* Image */}
						<article className="hidden lg:block lg:col-span-6">
							<img src="/banner.webp" className="w-[30rem]" alt="banner" />
						</article>
					</div>
				</section>
				{/* Services */}
				<section className="py-12 bg-white">
					<div className="container mx-auto">
						<h1 className="text-lg lg:text-xl font-semibold text-center mb-4">Services</h1>
						<div className="grid grid-cols-5 pb-4">
							{categories?.map(c => <button key={c.id} className="col-span-1 flex justify-center mt-4 outline-none">
								<div className="border border-gray-200 rounded-md w-[15rem] py-1 hover:border-transparent hover:bg-red-500 group shadow-md">
									<p className="font-semibold text-gray-700 uppercase group-hover:text-white">{c.name}</p>
								</div>
							</button>)}
						</div>
					</div>
				</section>
			</div>
		</>
	);
}