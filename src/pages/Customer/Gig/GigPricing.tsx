import { FaChevronDown, FaCheck } from 'react-icons/fa';
import { useState, useRef, useEffect, SetStateAction, Dispatch, ChangeEvent, FormEvent } from 'react';
import { BsFillInfoCircleFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import api from '@api';
import { useUser } from '@/contexts/UserContext';

export function GigPricing() {
	const user = useUser();
	const location = useLocation();
	const navigate = useNavigate();
	const queryParams = new URLSearchParams(location.search);
	const id = queryParams.get("id") as string;

	// Values and Errors States
	const [basicTitle, setBasicTitle] = useState<string | null>("");
	const [basicTitleError, setBasicTitleError] = useState(false);
	const [basicDescription, setBasicDescription] = useState<string | null>("");
	const [basicDescriptionError, setBasicDescriptionError] = useState(false);
	const [basicDeliveryDays, setBasicDeliveryDays] = useState<number | null>(null);
	const [basicDeliveryDaysError, setBasicDeliveryDaysError] = useState(false);
	const [basicRevision, setBasicRevision] = useState<number | null>(null);
	const [basicPriceError, setBasicPriceError] = useState(false);
	const [basicPrice, setBasicPrice] = useState<number | null>(null);

	const [standardTitle, setStandardTitle] = useState<string | null>("");
	const [standardTitleError, setStandardTitleError] = useState(false);
	const [standardDescription, setStandardDescription] = useState<string | null>("");
	const [standardDescriptionError, setStandardDescriptionError] = useState(false);
	const [standardDeliveryDays, setStandardDeliveryDays] = useState<number | null>(null);
	const [standardDeliveryDaysError, setStandardDeliveryDaysError] = useState(false);
	const [standardRevision, setStandardRevision] = useState<number | null>(null);
	const [standardPrice, setStandardPrice] = useState<number | null>(null);
	const [standardPriceError, setStandardPriceError] = useState<boolean>(false);

	const [premiumTitle, setPremiumTitle] = useState<string | null>("");
	const [premiumTitleError, setPremiumTitleError] = useState(false);
	const [premiumDescription, setPremiumDescription] = useState<string | null>("");
	const [premiumDescriptionError, setPremiumDescriptionError] = useState(false);
	const [premiumDeliveryDays, setPremiumDeliveryDays] = useState<number | null>(null);
	const [premiumDeliveryDaysError, setPremiumDeliveryDaysError] = useState(false);
	const [premiumRevision, setPremiumRevision] = useState<number | null>(null);
	const [premiumPrice, setPremiumPrice] = useState<number | null>(null);
	const [premiumPriceError, setPremiumPriceError] = useState(false);
	// Values and Error States

	// Turning on/off packages
	const [multPackages, setMultPackages] = useState(true);
	function handleMultPackages() {
		setMultPackages(!multPackages);
		// Disabling standard and premium errors
		setStandardTitleError(false);
		setStandardDescriptionError(false);
		setStandardDeliveryDaysError(false);
		setStandardPriceError(false);
		setPremiumTitleError(false);
		setPremiumDescriptionError(false);
		setPremiumDeliveryDaysError(false);
		setPremiumPriceError(false);
	}
	// Turning on/off packages

	const [gig, setGig] = useState<any>(null);
	useEffect(() => {
		api.get(`gig/${id}`).then(res => {
			const { data: gig } = res;
			setGig(gig);
			setMultPackages(gig.multipackages);
			gig.packages.sort((a: any, b: any) => a.index - b.index);
			const [basicPackage, standardPackage, premiumPackage] = gig.packages;
			if (gig.packages.length) {
				setBasicTitle(basicPackage.title);
				setBasicDescription(basicPackage.description);
				setBasicDeliveryDays(basicPackage.deliveryDays);
				setBasicRevision(basicPackage.revisions);
				setBasicPrice(Number(basicPackage.price));
				if (standardPackage) {
					setStandardTitle(standardPackage.title);
					setStandardDescription(standardPackage.description);
					setStandardDeliveryDays(standardPackage.deliveryDays);
					setStandardRevision(standardPackage.revisions);
					setStandardPrice(Number(standardPackage.price));

					setPremiumTitle(premiumPackage.title);
					setPremiumDescription(premiumPackage.description);
					setPremiumDeliveryDays(premiumPackage.deliveryDays);
					setPremiumRevision(premiumPackage.revisions);
					setPremiumPrice(Number(premiumPackage.price));
				}
			}
		});
	}, [id]);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		// Basic errors
		const newBasicTitleError = !basicTitle;
		const newBasicDescriptionError = !basicDescription;
		const newBasicDeliveryDaysError = !basicDeliveryDays;
		const newBasicPriceError = !basicPrice || Number(basicPrice) < 5 || Number(basicPrice) > 10000;
		const errors = [newBasicTitleError, newBasicDescriptionError, newBasicPriceError];
		setBasicTitleError(newBasicTitleError);
		setBasicDescriptionError(newBasicDescriptionError);
		setBasicDeliveryDaysError(newBasicDeliveryDaysError);
		setBasicPriceError(newBasicPriceError);

		if (multPackages) {
			// Standard
			const newStandardTitleError = !standardTitle;
			const newStandardDescriptionError = !standardDescription;
			const newStandardDeliveryDaysError = !standardDeliveryDays;
			const newStandardPriceError = !standardPrice || Number(standardPrice) < 5 || Number(standardPrice) > 10000;
			setStandardTitleError(newStandardTitleError);
			setStandardDescriptionError(newStandardDescriptionError);
			setStandardDeliveryDaysError(newStandardDeliveryDaysError);
			setStandardPriceError(newStandardPriceError);

			// Premium
			const newPremiumTitleError = !premiumTitle;
			const newPremiumDescriptionError = !premiumDescription;
			const newPremiumDeliveryDaysError = !premiumDeliveryDays;
			const newPremiumPriceError = !premiumPrice || Number(premiumPrice) < 5 || Number(premiumPrice) > 10000;
			setPremiumTitleError(newPremiumTitleError);
			setPremiumDescriptionError(newPremiumDescriptionError);
			setPremiumDeliveryDaysError(newPremiumDeliveryDaysError);
			setPremiumPriceError(newPremiumPriceError);
			// Adding to the error checker
			errors.push(newStandardTitleError, newStandardDescriptionError, newStandardPriceError, newPremiumTitleError, newPremiumDescriptionError, newPremiumPriceError);
		}

		// Continue submission
		if (!errors.some(e => e)) {
			await api.post(`gig/edit/${id}`, { multipackages: multPackages });
			const data = { gigId: id, packages: [{ title: basicTitle, description: basicDescription, revisions: basicRevision, price: basicPrice, deliveryDays: basicDeliveryDays, index: 0 }] };
			if (multPackages) {
				data.packages.push({ title: standardTitle, description: standardDescription, revisions: standardRevision, price: standardPrice, deliveryDays: standardDeliveryDays, index: 1 });
				data.packages.push({ title: premiumTitle, description: premiumDescription, revisions: premiumRevision, price: premiumPrice, deliveryDays: premiumDeliveryDays, index: 2 });
			}

			if (!gig.packages?.length) await api.post("package/create", data);
			else {
				await api.post(`package/update/${gig.packages[0].id}`, { gigId: id, ...data.packages[0] });
				if (multPackages) {
					// Check if the packages length is more than 1
					// If it is, update
					if (gig.packages.length > 1) {
						await api.post(`package/update/${gig.packages[1].id}`, { gigId: id, ...data.packages[1] });
						await api.post(`package/update/${gig.packages[2].id}`, { gigId: id, ...data.packages[2] });
					}
					// Otherwise, create new packages
					else await api.post("package/create", { gigId: id, packages: data.packages.slice(1, data.packages.length) });
				}
			}
			navigate(`/users/${user?.username}/manage_gigs/edit?tab=description&id=${id}`);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<article className="py-4">
				<header className="flex items-center justify-between">
					<h1 className="text-3xl text-gray-600"> Scope Pricing </h1>
					<div className="flex">
						<span className="text-[#62646a] mr-4"> Offer packages </span>
						<span className={`${multPackages ? "bg-[#222325]" : "bg-[#b5b6ba]"} h-[24px] w-[40px] inline-flex flex-col relative rounded-full cursor-pointer`} onClick={handleMultPackages}>
							<span
								className={`absolute rounded-[50%] h-[20px] w-[20px] m-[2px] bg-white inline-flex justify-center items-center duration-100 transition-all ${multPackages ? "left-4" : "left-0"}`}>
								{multPackages && <FaCheck size={10.5} />}
							</span>
						</span>
					</div>
				</header>
				<hr className="border-gray-300 mt-6 mb-7" />
				<h2 className="text-gray-500 font-semibold text-lg"> Packages </h2>
				<div className="relative">
					<table className="mt-3 border border-gray-300 w-full bg-white shadow-md">
						<thead>
							<tr>
								<td className="bg-[#fafafa] w-[22%] xl:w-[18%]" />
								<td className="p-4 border border-gray-300 bg-[#f5f5f5] font-bold text-gray-500 uppercase text-sm"> Basic </td>
								<td className="p-4 border border-gray-300 bg-[#f5f5f5] font-bold text-gray-500 uppercase text-sm"> Standard </td>
								<td className="p-4 border border-gray-300 bg-[#f5f5f5] font-bold text-gray-500 uppercase text-sm"> Premium </td>
							</tr>
						</thead>
						<tbody>
							{/* General Information */}
							<tr>
								<td className="bg-[#fafafa]" />
								<NameInput value={basicTitle} setValue={setBasicTitle} error={basicTitleError} />
								<NameInput value={standardTitle} setValue={setStandardTitle} error={standardTitleError} disabled={!multPackages} />
								<NameInput value={premiumTitle} setValue={setPremiumTitle} error={premiumTitleError} disabled={!multPackages}  />
							</tr>
							<tr>
								<td className="bg-[#fafafa]" />
								<DescriptionInput value={basicDescription} setValue={setBasicDescription} error={basicDescriptionError} />
								<DescriptionInput value={standardDescription} setValue={setStandardDescription} error={standardDescriptionError} disabled={!multPackages}  />
								<DescriptionInput value={premiumDescription} setValue={setPremiumDescription} error={premiumDescriptionError} disabled={!multPackages}  />
							</tr>
							<tr>
								<td className="p-4 border-b border-gray-300 bg-[#fafafa] font-semibold text-gray-500 uppercase text-sm align-bottom"> General Information </td>
								<DeliveryDaysInput value={basicDeliveryDays} setValue={setBasicDeliveryDays} error={basicDeliveryDaysError} />
								<DeliveryDaysInput value={standardDeliveryDays} setValue={setStandardDeliveryDays} error={standardDeliveryDaysError} disabled={!multPackages}  />
								<DeliveryDaysInput value={premiumDeliveryDays} setValue={setPremiumDeliveryDays} error={premiumDeliveryDaysError} disabled={!multPackages}  />
							</tr>
							{/* Revisions */}
							<tr>
								<td className="p-4 border border-gray-300 bg-[#fafafa] font-semibold text-gray-500 uppercase text-sm"> Revisions </td>
								<RevisionInput value={basicRevision} setValue={setBasicRevision} />
								<RevisionInput value={standardRevision} setValue={setStandardRevision} disabled={!multPackages}  />
								<RevisionInput value={premiumRevision} setValue={setPremiumRevision} disabled={!multPackages}  />
							</tr>
							{/* Price */}
							<tr>
								<td className="p-4 border border-gray-300 bg-[#fafafa] font-semibold text-gray-500 uppercase text-sm"> Price </td>
								<PriceInput value={basicPrice} setValue={setBasicPrice} error={basicPriceError} />
								<PriceInput value={standardPrice} setValue={setStandardPrice} error={standardPriceError} disabled={!multPackages}  />
								<PriceInput value={premiumPrice} setValue={setPremiumPrice} error={premiumPriceError} disabled={!multPackages}  />
							</tr>
						</tbody>
					</table>
					{/* Overlay if they only want 1 package */}
					{!multPackages && <div className="absolute bg-[rgba(255,255,255,0.9)] top-0 right-0 w-[52.1%] xl:w-[54.7%] h-full flex justify-center items-center border border-gray-300" >
						<div className="flex flex-col">
							<h1 className="font-bold w-[19rem] text-center text-xl text-[#74767b] mb-3"> Offer packages to meet the needs of more buyers. </h1>
							<button type="button" className="bg-[#567ce9] hover:bg-[#446ee7] active:bg-[#3f63c8] py-2 px-3 mx-[12%] mt-2 rounded-md font-semibold text-white text-lg" onClick={handleMultPackages}>
								Create Packages
							</button>
						</div>
					</div>}
				</div>
			</article>
			<div className="flex justify-end mt-1">
				<button className="bg-[#222325] text-white font-bold text-lg py-[0.6rem] hover:bg-[#505256] px-4 rounded-md" type="submit"> Save & Continue </button>
			</div>
		</form>
	)
}

interface InputProps<T> {
	value: T | null;
	setValue: Dispatch<SetStateAction<T | null>>;
	error?: boolean;
	disabled?: boolean;
}

function NameInput(props: InputProps<string>) {
	return <TextInput
		disabled={props.disabled}
		value={props.value}
		setValue={props.setValue}
		error={props.error}
		placeholder="Name your package"
		maxLength={35}
		textareaClassname="h-13 text-[#4e5369]"
		errorClassname="right-0 bottom-[1.45rem]"
		errorText="Title can't be empty"
	/>
}

function DescriptionInput(props: InputProps<string>) {
	return <TextInput
		disabled={props.disabled}
		value={props.value}
		setValue={props.setValue}
		error={props.error}
		placeholder="Describe the details of your offering"
		maxLength={100}
		textareaClassname="h-36 text-[#4e5369]"
		errorClassname="right-0 top-6"
		errorText="Description can't be empty"
	/>
}

interface TextInputProps extends InputProps<string> {
	placeholder: string;
	maxLength: number;
	textareaClassname: string;
	errorText: string;
	errorClassname: string;
}
function TextInput(props: TextInputProps) {
	const [isErrorVisible, setIsErrorVisible] = useState(false);
	const showError = () => setIsErrorVisible(true);
	const hideError = () => setIsErrorVisible(false);
	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => props.setValue(e.target.value);

	return (
		<td className="border border-gray-300">
			<div className="flex">
				<textarea className={`w-full outline-none resize-none p-2 text-sm bg-transparent text-gray-700 overflow-hidden ${props.textareaClassname}`} onChange={handleChange} placeholder={props.placeholder} maxLength={props.maxLength} value={props.value as string} disabled={props.disabled} />
				{props.error && <div className="flex mr-3 mt-3 relative h-max" onMouseOver={showError} onMouseLeave={hideError}>
					<BsFillInfoCircleFill className="text-red-500" />
					{isErrorVisible && <div className={`absolute bg-[#3b3b3b] w-max rounded-md p-2 text-sm text-white ${props.errorClassname}`}> {props.errorText} </div>}
				</div>}
			</div>
		</td>
	)
}

function PriceInput(props: InputProps<number>) {
	const [isErrorVisible, setIsErrorVisible] = useState(false);
	const showError = () => setIsErrorVisible(true);
	const hideError = () => setIsErrorVisible(false);

	function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
		if (isNaN(Number(e.target.value))) return;
		props.setValue(Number(e.target.value));
	}

	return (
		<td className="p-2 border border-gray-300 text-gray-500 relative items-center align-middle">
			<div className="flex justify-between relative">
				<div className="mr-1"> $ </div>
				<textarea maxLength={5} className="outline-none resize-none overflow-hidden h-6 w-full" onChange={handleChange} value={props.value ? props.value > 0 ? props.value : "" : ""} disabled={props.disabled} />
				{props.error && (
					<div className="flex mr-1 items-center absolute right-0 top-1" onMouseOver={showError} onMouseLeave={hideError} >
						<BsFillInfoCircleFill className="text-red-500" />
						{isErrorVisible && <div className="absolute bg-[#3b3b3b] right-0 top-7 w-72 rounded-md p-2 text-sm text-white"> Please adjust this package price so that the price is between $5 and $10,000. </div>}
					</div>
				)}
			</div>
		</td>
	);
}

function RevisionInput(props: InputProps<number>) {
	const [isDropmenuVisible, setIsDropmenuVisible] = useState(false);
	const handleDropmenuVisible = () => setIsDropmenuVisible(!isDropmenuVisible);
	const closeDropMenu = () => setIsDropmenuVisible(false);
	const ref = useRef<HTMLTableCellElement>(null);
	useEffect(function () {
		function handleOutsideClick(event: globalThis.MouseEvent) {
			if (ref.current && event.target instanceof Node && ref.current.contains(event.target)) return;
			closeDropMenu();
		}
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

	function handleSelect(value: number | null) {
		props.setValue(value);
		closeDropMenu();
	}

	return (
		<td className="border border-gray-300 cursor-pointer relative" onClick={handleDropmenuVisible} ref={ref}>
			<div className="flex items-center justify-between p-2">
				<input type="text" value={props.value != null ? props.value == -1 ? "UNLIMITED" : props.value : "SELECT"} className="outline-none text-gray-500 cursor-pointer text-sm" readOnly disabled={props.disabled} />
				<FaChevronDown className="text-gray-500" />
			</div>
			{isDropmenuVisible && (
				<ul className="absolute bg-white border w-36 h-[9rem] overflow-auto left-0 top-[3.2rem] z-10 text-sm">
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(null)}> SELECT </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(0)}> 0 </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(1)}> 1 </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(2)}> 2 </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(3)}> 3 </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(4)}> 4 </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(5)}> 5 </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(6)}> 6 </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(7)}> 7 </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(8)}> 8 </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(9)}> 9 </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(10)}> 10 </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(-1)}> UNLIMITED </li>
				</ul>
			)}
		</td>
	);
}

function DeliveryDaysInput(props: InputProps<number>) {
	const [isErrorVisible, setIsErrorVisible] = useState(false);
	const showError = () => setIsErrorVisible(true);
	const hideError = () => setIsErrorVisible(false);
	4
	const [isDropmenuVisible, setIsDropmenuVisible] = useState(false);
	const handleDropmenuVisible = () => setIsDropmenuVisible(!isDropmenuVisible);
	const closeDropMenu = () => setIsDropmenuVisible(false);
	const ref = useRef<HTMLTableCellElement>(null);
	useEffect(function () {
		function handleOutsideClick(event: globalThis.MouseEvent) {
			if (ref.current && event.target instanceof Node && ref.current.contains(event.target)) return;
			closeDropMenu();
		}
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

	function handleSelect(value: number | null) {
		props.setValue(value);
		closeDropMenu();
	}

	return (
		<td className="border border-gray-300 cursor-pointer relative" onClick={handleDropmenuVisible} ref={ref}>
			<div className="flex items-center justify-between p-2 relative">
				<input type="text" value={props.value != null ? `${props.value} DAY${props.value > 1 ? "S" : ""}` : "DELIVERY TIME"} className="outline-none text-gray-500 cursor-pointer text-sm" readOnly disabled={props.disabled} />
				<FaChevronDown className="text-gray-500" />
				{props.error && (
					<div className="flex right-8 items-center absolute cursor-default" onMouseOver={showError} onMouseLeave={hideError} >
						<BsFillInfoCircleFill className="text-red-500" />
						{isErrorVisible && <div className="absolute bg-[#3b3b3b] right-0 bottom-[1.35rem] w-max rounded-md p-2 text-sm text-white"> Delivery time can't be empty. </div>}
					</div>
				)}
			</div>
			{isDropmenuVisible && (
				<ul className="absolute bg-white border w-36 h-[9rem] overflow-auto left-0 top-[3.2rem] z-10 text-sm">
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(null)}> DELIVERY TIME </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(1)}> 1 DAY </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(2)}> 2 DAYS </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(3)}> 3 DAYS </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(4)}> 4 DAYS </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(5)}> 5 DAYS </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(6)}> 6 DAYS </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(7)}> 7 DAYS </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(10)}> 10 DAYS </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(14)}> 14 DAYS </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(21)}> 21 DAYS </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(30)}> 30 DAYS </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(45)}> 45 DAYS </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(60)}> 60 DAYS </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(75)}> 75 DAYS </li>
					<li className="p-2 hover:bg-gray-100 text-gray-500" onClick={() => handleSelect(90)}> 90 DAYS </li>
				</ul>
			)}
		</td>
	);
}