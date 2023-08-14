import { ReactNode, useState, useEffect, useRef, FormEvent } from 'react';
import { FaChevronDown } from "react-icons/fa";
import api from '@api';
import { useUser } from '@/contexts/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';

export function GigOverview() {
	const user = useUser();
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);

	const [categories, setCategories] = useState<any[]>([]);
	useEffect(() => { api.get("/category").then(res => setCategories(res.data)) }, []);

	const [gigTitleError, setGigTitleError] = useState("");
	const [gigTitleValue, setGigTitleValue] = useState("");

	function handleGigTitle(value: string, focused: boolean = true) {
		setGigTitleValue(value);
		if (value.length < 15) setGigTitleError(focused ? "15 characters minimum." : "Create a title with 15 characters minimum. Your title should have at least 4 words.");
		else if (value.split(" ").filter(s => s.length).length < 4) setGigTitleError(focused ? "4 words minimum." : "Your title should have at least 4 words.");
		else if (value.split(" ").filter(s => s.length).length > 15) setGigTitleError(focused ? "Great titles contain no more than 15 words." : "Great titles have 4-15 words maximum.");
		else if (value.length > 70) setGigTitleError("Shorter titles attract more buyers.");
		else {
			setGigTitleError("");
			return false;
		}
		return true;
	}

	const [categoryError, setCategoryError] = useState("");
	const [category, setCategory] = useState<any>(null);
	const [subcategory, setSubcategory] = useState<any>(null);
	function handleCategorySelection(category: any) {
		setSubcategory(null);
		setCategory(category);
	}
	function handleCategoryError() {
		if (!category) setCategoryError("Select a category and a subcategory to continue.");
		else if (!subcategory) setCategoryError("Select a subcategory to continue.");
		else {
			setCategoryError("");
			return false;
		}
		return true;
	}

	async function handleSelect(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		let hasError = handleGigTitle(gigTitleValue, false);
		if (!hasError) hasError = handleCategoryError();

		if (!hasError) {
			if (!id) {
				const { data } = await api.post("/gig/create", { title: gigTitleValue, ownerId: user?.id, subcategoryId: subcategory.id });
				navigate(`/users/${user?.username}/manage_gigs/edit?tab=pricing&id=${data.id}`);
			}
			else {
				await api.post(`/gig/edit/${id}`, { title: gigTitleValue, subcategoryId: subcategory.id });
				navigate(`/users/${user?.username}/manage_gigs/edit?tab=pricing&id=${id}`);
			}
		}
	}

	const id = queryParams.get("id") as string;
	useEffect(function() { 
		if (id) {
			api.get(`/gig/${id}`).then(async function(response) {
				setGigTitleValue(response.data.title);
				const { data: subcategory } = await api.get(`/subcategory/${response.data.subcategoryId}`);
				setCategory(subcategory.category);
				setSubcategory(subcategory);
			});
		}
	}, []);

	return (
		<form onSubmit={handleSelect}>
			<article className="bg-white rounded-md border shadow-md px-12 py-8">
				{/* Gig title */}
				<section className="flex">
					{/* Left */}
					<div className="w-[22%] mr-8">
						<h1 className="font-semibold text-lg text-gray-600"> Gig title </h1>
						<p className="text-[0.95rem] mt-1"> As your Gig storefront, your <span className="font-semibold text-gray-800">title is the most important place</span> to include keywords that buyers would likely use to search for a service like yours. </p>
					</div>
					{/* Right */}
					<div className="w-[78%] relative h-full">
						<span className="font-bold text-gray-400 absolute pl-[1.2rem] pt-[0.55rem]"> I will </span>
						<textarea value={gigTitleValue} onChange={e => handleGigTitle(e.target.value)} onFocus={e => handleGigTitle(e.target.value)} onBlur={e => handleGigTitle(e.target.value, false)} className="border w-full h-[5rem] rounded-md outline-none pt-2 px-4 resize-none font-semibold indent-[2.7rem] text-gray-600 overflow-hidden" maxLength={80} />
						{/* Errors */}
						<div className="flex justify-between mt-1">
							{!gigTitleError && gigTitleValue && gigTitleValue.length <= 60 && <span className="text-sm w-3/4 text-green-500"> Just perfect! </span>}
							{!gigTitleError && gigTitleValue && gigTitleValue.length > 60 && <span className="text-sm w-3/4 text-red-500"> Looks good, however, shorter titles sell better. </span>}
							{gigTitleError && <span className="text-sm w-3/4 text-red-500"> {gigTitleError} </span>}
							<span className={`text-sm ${gigTitleValue.length == 80 ? "text-red-500" : "text-gray-500"} ml-auto`}> {gigTitleValue.length} / 80 max </span>
						</div>
					</div>
				</section>
				{/* Category */}
				<section className="mt-8 flex">
					<div className="w-[22%] mr-8">
						<h1 className="font-semibold text-lg text-gray-600"> Category </h1>
						<p className="text-[0.95rem] mt-1"> Choose the category and sub-category most suitable for your Gig. </p>
					</div>
					<div className="w-[78%]">
						<div className="flex">
							<DropdownInput value={category?.name.toUpperCase()} placeholder="SELECT A CATEGORY" className="w-1/2">
								{categories?.map(category => <li key={category.id} onClick={() => handleCategorySelection(category)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer"> {category.name} </li>)}
							</DropdownInput>
							<div className="mx-3" />
							<DropdownInput value={subcategory?.name.toUpperCase()} placeholder="SLECT A SUBCATEGORY" className="w-1/2">
								{categories && !category && (<li className="px-4 py-2 cursor-default text-gray-400"> No options </li>)}
								{categories && category?.subcategories.map((subcategory: any) => <li key={subcategory.id} onClick={() => setSubcategory(subcategory)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer"> {subcategory.name} </li>)}
							</DropdownInput>
						</div>
						<div className="mt-2"> <span className="text-sm text-red-500"> {categoryError} </span> </div>
					</div>
				</section>
			</article>
			<div className="flex justify-end mt-5">
				<button className="bg-[#222325] text-white font-bold text-lg py-[0.6rem] hover:bg-[#505256] px-4 rounded-md" type="submit"> Save & Continue </button>
			</div>
		</form>
	);
}

interface DropdownInputProps {
	children: ReactNode;
	placeholder: string;
	className?: string;
	value: string;
}
function DropdownInput(props: DropdownInputProps) {
	const [isDropmenuVisible, setIsDropmenuVisible] = useState(false);
	const handleDropmenuVisible = () => setIsDropmenuVisible(!isDropmenuVisible);
	const closeDropMenu = () => setIsDropmenuVisible(false);
	const ref = useRef<HTMLDivElement>(null);
	useEffect(function () {
		function handleOutsideClick(event: globalThis.MouseEvent) {
			if (ref.current && event.target instanceof Node && ref.current.contains(event.target)) return;
			closeDropMenu();
		}
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

	return (
		<div className={`relative flex ${props.className}`} ref={ref} onClick={handleDropmenuVisible}>
			<input type="text" placeholder={props.placeholder} defaultValue={props.value} className="border py-[0.4rem] text-gray-600 px-4 rounded-md h-fit w-full outline-none cursor-pointer" readOnly />
			<FaChevronDown className="absolute right-[1rem] top-[0.75rem] text-gray-400" />
			{isDropmenuVisible && <ul className="absolute top-12 bg-white border w-full shadow-md rounded-l-md overflow-y-auto max-h-60 uppercase text-gray-600"> {props.children} </ul>}
		</div>
	);
}