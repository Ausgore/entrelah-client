import { FormEvent, useState } from "react"
import api from '@api';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from "@contexts/UserContext";
import { AiOutlineLink } from "react-icons/ai";
import { motion, useAnimation } from 'framer-motion';

export function GigPublish() {
	const navigate = useNavigate();
	const user = useUser();
	const [submitted, setSubmitted] = useState(false);
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const id = queryParams.get("id") as string;

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!submitted) {
			await api.post(`gig/edit/${id}`, { status: 1 });
			setSubmitted(true);
		}
		else navigate(`/users/${user?.username}/manage_gigs`);
	}

	const controls = useAnimation();
	const handleCopy = async () => {
		controls.start({ opacity: 0.8 });
		setTimeout(() => controls.start({ opacity: 0 }), 1000);
		await navigator.clipboard.writeText(`http://localhost:5173/users/${user?.username}/${id}`);
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="bg-white w-full py-36 mb-6 border shadow-md flex justify-center">
				<div>
					<img src="/gigpublish.webp" alt="gigpublish" className="h-36 mx-auto" />
					{!submitted && <div className="text-center mt-8">
						<h1 className="text-3xl font-bold text-gray-800 mb-2"> You're almost there! </h1>
						<p className="text-lg font-semibold text-gray-700"> Let's publish your Gig and get you ready to start selling. </p>
					</div>}
					{submitted && <div className="text-center mt-4">
						<h1 className="text-4xl font-bold text-[#00668c] mb-1"> Your Gig is open for business! </h1>
						<h2 className="text-2xl font-bold text-gray-500 mb-4"> Spread the word to boost your sales </h2>
						<div className="relative">
							<p className="border py-1 px-2 rounded-md border-gray-300 text-gray-500 hover:text-gray-800 hover:border-gray-800 cursor-pointer flex items-center" onClick={handleCopy}>
								<AiOutlineLink size={18} className="mr-2" /> {`http://localhost:5173/users/${user?.username}/${id}`}
							</p>
							<motion.div initial={{ opacity: 0 }} animate={controls} className="absolute right-0 bg-black text-white mt-2 px-4 py-1 rounded-md"> Copied to clipboard! </motion.div>
						</div>
					</div>}
				</div>
			</div>
			<div className="flex justify-end mt-1">
				<button className="bg-[#222325] text-white font-bold text-lg py-[0.6rem] hover:bg-[#505256] px-4 rounded-md" type="submit"> {!submitted ? "Publish Gig" : "Done"} </button>
			</div>
		</form>
	)
}