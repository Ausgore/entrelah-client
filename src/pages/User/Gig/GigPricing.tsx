import { FaChevronDown } from 'react-icons/fa';
import { useState, useRef, useEffect, SetStateAction, Dispatch, ChangeEvent, FormEvent } from 'react';
import { BsFillInfoCircleFill } from "react-icons/bs";

export function GigPricing() {

	const [basicName, setBasicName] = useState<string | null>(null);
	const [basicNameError, setBasicNameError] = useState(false);
	const [basicRevision, setBasicRevision] = useState<number | null>(null);
	const [basicPriceError, setBasicPriceError] = useState(false);
	const [basicPrice, setBasicPrice] = useState<string | null>(null);

	const [standardName, setStandardName] = useState<string | null>(null);
	const [standardNameError, setStandardNameError] = useState(false);
	const [standardRevision, setStandardRevision] = useState<number | null>(null);
	const [standardPrice, setStandardPrice] = useState<string | null>(null);
	const [standardPriceError, setStandardPriceError] = useState<boolean>(false);

	const [premiumName, setPremiumName] = useState<string | null>(null);
	const [pNameError, setPremiumNameError] = useState(false);
	const [premiumRevision, setPremiumRevision] = useState<number | null>(null);
	const [premiumPrice, setPremiumPrice] = useState<string | null>(null);
	const [premiumPriceError, setPremiumPriceError] = useState(false);

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!basicPrice || Number(basicPrice) < 5 || Number(basicPrice) > 10000) setBasicPriceError(true);
		else setBasicPriceError(false);
		if (!basicName) setBasicNameError(true);
		else setBasicNameError(false);


		if (!standardPrice || Number(standardPrice) < 5 || Number(standardPrice) > 10000) setStandardPriceError(true);
		else setStandardPriceError(false);
		if (!standardName) setStandardNameError(true);
		else setStandardNameError(false);

		if (!premiumPrice || Number(premiumPrice) < 5 || Number(premiumPrice) > 10000) setPremiumPriceError(true);
		else setPremiumPriceError(false);
		if (!premiumName) setPremiumNameError(true);
		else setPremiumNameError(false);
	}

	return (
		<form onSubmit={handleSubmit}>
			<article className="py-4">
				<header className="flex items-center">
					<h1 className="text-3xl text-gray-600"> Scope Pricing </h1>
				</header>
				<hr className="border-gray-300 mt-6 mb-7" />
				<h2 className="text-gray-500 font-semibold text-lg"> Packages </h2>
				<table className="mt-3 border border-gray-300 w-full bg-white shadow-md">
					<thead>
						<tr>
							<td className="bg-[#fafafa] w-2/12" />
							<td className="p-4 border border-gray-300 bg-[#f5f5f5] font-bold text-gray-500 uppercase text-sm"> Basic </td>
							<td className="p-4 border border-gray-300 bg-[#f5f5f5] font-bold text-gray-500 uppercase text-sm"> Standard </td>
							<td className="p-4 border border-gray-300 bg-[#f5f5f5] font-bold text-gray-500 uppercase text-sm"> Premium </td>
						</tr>
					</thead>
					<tbody>
						{/* General Information */}
						<tr>
							<td className="bg-[#fafafa]" />
							<NameInput value={basicName} setValue={setBasicName} error={basicNameError} />
							<NameInput value={standardName} setValue={setStandardName} error={standardNameError} />
							<NameInput value={premiumName} setValue={setPremiumName} error={pNameError} />
						</tr>
						<tr>
							<td className="p-4 border-b border-gray-300 bg-[#fafafa] font-semibold text-gray-500 uppercase text-sm align-bottom"> General Information </td>
							<td className="border border-gray-300"> <textarea className="w-full h-36 outline-none resize-none p-2 text-sm text-gray-700" placeholder="Describe the details of your offering" maxLength={100} /> </td>
							<td className="border border-gray-300"> <textarea className="w-full h-36 outline-none resize-none p-2 text-sm text-gray-700" placeholder="Describe the details of your offering" maxLength={100} /> </td>
							<td className="border border-gray-300"> <textarea className="w-full h-36 outline-none resize-none p-2 text-sm text-gray-700" placeholder="Describe the details of your offering" maxLength={100} /> </td>
						</tr>
						{/* Revisions */}
						<tr>
							<td className="p-4 border border-gray-300 bg-[#fafafa] font-semibold text-gray-500 uppercase text-sm"> Revisions </td>
							<RevisionInput value={basicRevision} setValue={setBasicRevision} />
							<RevisionInput value={standardRevision} setValue={setStandardRevision} />
							<RevisionInput value={premiumRevision} setValue={setPremiumRevision} />
						</tr>
						{/* Price */}
						<tr>
							<td className="p-4 border border-gray-300 bg-[#fafafa] font-semibold text-gray-500 uppercase text-sm"> Price </td>
							<PriceInput value={basicPrice} setValue={setBasicPrice} error={basicPriceError} />
							<PriceInput value={standardPrice} setValue={setStandardPrice} error={standardPriceError} />
							<PriceInput value={premiumPrice} setValue={setPremiumPrice} error={premiumPriceError} />
						</tr>
					</tbody>
				</table>
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
}

function NameInput(props: InputProps<string>) {
	const [isErrorVisible, setIsErrorVisible] = useState(false);
	const showError = () => setIsErrorVisible(true);
	const hideError = () => setIsErrorVisible(false);

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => props.setValue(e.target.value);
	return (
		<td className="border border-gray-300">
			<div className="flex">
				<textarea className="w-full h-13 outline-none resize-none p-2 text-sm bg-transparent text-gray-700 overflow-hidden" onChange={handleChange} placeholder="Name your package" maxLength={35} />
				{props.error && <div className="flex mr-3 items-center relative" onMouseOver={showError} onMouseLeave={hideError} >
					<BsFillInfoCircleFill className="text-red-600" />
					{isErrorVisible && <div className="absolute bg-[#3b3b3b] right-0 bottom-11 w-max rounded-md p-2 text-sm text-white"> Title can't be empty </div>}
				</div>}
			</div>
		</td>
	);
}

function PriceInput(props: InputProps<string>) {
	const [isErrorVisible, setIsErrorVisible] = useState(false);
	const showError = () => setIsErrorVisible(true);
	const hideError = () => setIsErrorVisible(false);

	function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
		if (isNaN(Number(e.target.value))) return;
		props.setValue(e.target.value);
	}

	return (
		<td className="p-2 border border-gray-300 text-gray-500 relative items-center align-middle">
			<div className="flex justify-between">
				<div className="mr-1"> $ </div>
				<textarea maxLength={5} className="outline-none resize-none overflow-hidden h-6 w-full" onChange={handleChange} value={props.value ?? ""} />
				{props.error && (
					<div className="flex mr-1 items-center relative" onMouseOver={showError} onMouseLeave={hideError} >
						<BsFillInfoCircleFill className="text-red-600" />
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
				<input type="text" value={props.value != null ? props.value == -1 ? "UNLIMITED" : props.value : "SELECT"} className="outline-none text-gray-500 cursor-pointer" readOnly />
				<FaChevronDown className="text-gray-500" />
			</div>
			{isDropmenuVisible && (
				<ul className="absolute bg-white border w-36 h-[13rem] overflow-auto left-0 top-[3.2rem] z-10">
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