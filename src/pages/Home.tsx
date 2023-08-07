import CustomerNav from '@/components/CustomerNav/CustomerNav';
import { AiOutlineSearch } from "react-icons/ai";
import { useEffect } from 'react';

export default function Home() {
	useEffect(() => { document.title = "Entrelah - Freelance Services Marketplace" }, []);

	return (
		<>
			<CustomerNav />
			{/* Hero Article */}
			<section className="pt-40 relative">
				<div className="container mx-auto">
					<div className="grid grid-cols-12 py-0 lg:py-5 my-6">
						{/* Text and Search */}
						<article className="col-span-full lg:col-span-6 lg:mx-6 relative">
							<h1 className="font-semibold text-gray-900 drop-shadow-sm mb-3 text-4xl xl:text-5xl text-center lg:text-left"> Find the Perfect Freelance Services for Your Business </h1>
							<h2 className="text-gray-900 drop-shadow-md text-xl text-center lg:text-left"> Millions of people use Entrelah to turn their ideas into reality </h2>
							{/* Search */}
							<div className="flex flex-col lg:flex-row justify-center lg:justify-normal mx-6 lg:mx-0 mt-8">
								<input type="text" placeholder="Find Services..." className="w-full lg:w-[24rem] xl:w-[32rem] p-3 pl-6 rounded-md lg:rounded-none lg:rounded-l-md shadow-md" />
								<button className="mt-6 lg:mt-0 p-3 flex justify-center bg-red-500 shadow-md rounded-md lg:rounded-none lg:rounded-r-md"> <AiOutlineSearch size={22} className="text-white" /> </button>
							</div>
						</article>
						{/* Image */}
						<article className="hidden lg:block lg:col-span-6">
							<img src="banner.webp" className="w-[30rem]" alt="banner" />
						</article>
					</div>
				</div>
			</section>
		</>
	);
}