import { useState, ChangeEvent, KeyboardEvent, FormEvent, useEffect } from 'react';
import api from '@api';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { FaPlus } from "react-icons/fa";
import { HiOutlineMenu } from "react-icons/hi";

export function GigDescription() {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const id = queryParams.get("id") as string;

	const user = useUser();
	useEffect(() => {
		api.get(`gig/${id}`).then(res => {
			setGig(res.data);
			setDescription(res.data.description ?? "");
		});
	}, [id]);

	const [gig, setGig] = useState<any | null>(null);


	const [question, setQuestion] = useState("");
	const [questionError, setQuestionError] = useState(false);
	const handleQuestionError = (value: string) => {
		if (!value) setQuestionError(true);
		else {
			setQuestionError(false);
			return false;
		}
		return true;
	}
	const handleQuestionValue = (value: string) => setQuestion(value);
	const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
		handleQuestionValue(e.target.value);
		handleQuestionError(e.target.value);
	}

	const [answer, setAnswer] = useState("");
	const [answerError, setAnswerError] = useState(false);
	const handleAnswerError = (value: string) => {
		if (!value) setAnswerError(true);
		else {
			setAnswerError(false);
			return false;
		}
		return true;
	}
	const handleAnswerValue = (value: string) => setAnswer(value);
	const handleAnswerChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		handleAnswerValue(e.target.value);
		handleAnswerError(e.target.value);
	}

	const [isCreatingFaq, setIsCreatingFaq] = useState(false);
	const handleCreatingFaq = () => {
		setQuestionError(false);
		setAnswerError(false);
		setIsCreatingFaq(!isCreatingFaq);
		setQuestion("");
		setAnswer("");
	}

	const addFaq = async () => {
		let error = handleQuestionError(question);
		if (!error) error = handleAnswerError(answer);
		if (!error) {
			await api.post(`faq/create`, { gigId: id, faqs: [{ question, answer }] });
			const { data: gig } = await api.get(`gig/${id}`);
			setGig(gig);
			handleCreatingFaq();
		}
	}
	const updateFaq = async (faqId: string, faq: any) => {
		await api.post(`faq/update/${faqId}`, faq);
		const { data: gig } = await api.get(`gig/${id}`);
		setGig(gig);
	}
	const deleteFaq = async (faqId: string) => {
		await api.delete(`faq/delete/${faqId}`);
		const { data: gig } = await api.get(`gig/${id}`);
		setGig(gig);
	}

	const [description, setDescription] = useState("");
	const [descriptionError, setDescriptionError] = useState("");
	const handleDescriptionError = (description: string) => {
		if (description.length < 120) setDescriptionError("Description should be at least 120 characters long");
		else {
			setDescriptionError("");
			return false;
		}
		return true;
	}

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);
	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (description.length >= 1000) return;
		if (e.key == "Tab") {
			e.preventDefault();
			const start = e.currentTarget.selectionStart;
			const end = e.currentTarget.selectionEnd;
			setDescription(d => d.substring(0, start) + "\t" + d.substring(end))
			e.currentTarget.selectionStart = end + 1;
		}
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const error = handleDescriptionError(description);
		if (!error) {
			await api.post(`gig/edit/${id}`, { description });
			navigate(`/users/${user?.username}/manage_gigs/edit?tab=gallery&id=${id}`);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<article className="py-4">
				<h1 className="text-3xl text-gray-600"> Description </h1>
				<hr className="border-gray-300 mt-6 mb-7" />
				<h2 className="text-gray-700 text-[1.02rem]"> Briefly Describe Your Gig </h2>
				{/* Textarea */}
				<div>
					<textarea value={description} maxLength={1000} onKeyDown={handleKeyDown} onChange={handleChange} className="w-full h-64 overflow-y-scroll resize-none outline-none border border-gray-300 mt-4 p-2" />
					<div className={`flex justify-end text-[0.83rem] ${description?.length >= 1000 ? "text-red-600" : "text-gray-500"}`}> {description?.length} / 1000 Characters</div>
				</div>
				{/* Error */}
				<p className="text-red-600 text-sm"> {descriptionError} </p>
			</article>
			<article className="py-4">
				<header className="flex align-middle items-baseline justify-between">
					<h1 className="text-3xl text-gray-600"> Frequently Asked Questions </h1>
					{!isCreatingFaq && <button type="button" className="text-red-500 font-bold flex items-center" onClick={handleCreatingFaq}> <FaPlus className="mr-3" /> Add FAQ </button>}
				</header>
				<hr className="border-gray-300 mt-6 mb-7" />
				<section>
					<h2 className="text-gray-800 text-lg tracking-tight mb-4"> Add Questions & Answers for your Buyers. </h2>
					{!isCreatingFaq && gig?.faqs.length < 1 && <button type="button" className="text-red-500 font-bold flex items-center" onClick={handleCreatingFaq}> <FaPlus className="mr-3" /> Add FAQ </button>}
					{/* Creating new faq */}
					{isCreatingFaq && <div className="flex flex-col mb-8">
						<input type="text" className={`border ${questionError ? "border-red-500" : "border-gray-300"} outline-none p-2 mt-3 mb-4 rounded-md`} value={question} onChange={handleQuestionChange} maxLength={50} placeholder="Add a Question: i.e. Do you translate to English as well?" />
						<textarea className={`border ${answerError ? "border-red-500" : "border-gray-300"} outline-none p-2 resize-none rounded-md h-24`} value={answer} onChange={handleAnswerChange} maxLength={300} placeholder="Add an Answer: i.e. Yes, I also translate from English to Hebrew." />
						<div className="flex justify-end mt-2">
							<div className="text-right">
								<span className={`${answerError ? "text-red-600" : "text-gray-500"} text-right`}> {answer?.length} / 300 characters </span>
								<div className="justify-end flex mt-2">
									<button type="button" className="bg-[#cececf] px-3 py-1 mr-4 font-semibold rounded-md" onClick={handleCreatingFaq}> Cancel </button>
									<button type="button" className="bg-[#222325] px-3 py-1 font-semibold rounded-md text-white" onClick={addFaq}> Add </button>
								</div>
							</div>
						</div>
					</div>}
					<div className="mb-4" />
					{/* All faqs */}
					{gig?.faqs.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((faq: any) => <FaqCard faq={faq} key={faq.id} updateFaq={updateFaq} deleteFaq={() => deleteFaq(faq.id)} />)}
				</section>
				<hr className="border-gray-300 mt-7 mb-7" />
			</article>
			<div className="flex justify-end mt-1 mb-12">
				<button className="bg-[#222325] text-white font-bold text-lg py-[0.6rem] hover:bg-[#505256] px-4 rounded-md" type="submit"> Save & Continue </button>
			</div>
		</form>
	)
}

interface FaqCardProps {
	faq: any;
	updateFaq: (faqId: string, faq: any) => void;
	deleteFaq: () => void;
}
function FaqCard(props: FaqCardProps) {
	const [collapsed, setCollapsed] = useState(true);
	const handleCollapse = () => setCollapsed(!collapsed);

	const [question, setQuestion] = useState(props.faq.question);
	const [questionError, setQuestionError] = useState(false);
	const handleQuestionValue = (value: string) => setQuestion(value);
	const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
		handleQuestionValue(e.target.value);
		handleQuestionError(e.target.value);
	}
	const handleQuestionError = (value: string) => {
		if (!value) setQuestionError(true);
		else {
			setQuestionError(false);
			return false;
		}
		return true;
	}

	const [answer, setAnswer] = useState(props.faq.answer);
	const [answerError, setAnswerError] = useState(false);
	const handleAnswerValue = (value: string) => setAnswer(value);
	const handleAnswerChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		handleAnswerValue(e.target.value);
		handleAnswerError(e.target.value);
	}
	const handleAnswerError = (value: string) => {
		if (!value) setAnswerError(true);
		else {
			setAnswerError(false);
			return false;
		}
		return true;
	}

	const handleCancel = () => {
		setQuestionError(false);
		setAnswerError(false);
		setCollapsed(true);
		setQuestion(props.faq.question);
		setAnswer(props.faq.answer);
	}
	const updateFaq = async () => {
		let error = handleQuestionError(question);
		if (!error) error = handleAnswerError(answer);
		if (!error) {
			setQuestionError(false);
			setAnswerError(false);
			setCollapsed(true);
			props.updateFaq(props.faq.id, { answer, question });
		}
	}


	return <div className="bg-white border border-gray-300 px-4 mb-3">
		<header className="py-4 flex items-center font-semibold text-lg cursor-pointer text-gray-600" onClick={handleCollapse}> <HiOutlineMenu className="mr-3 text-gray-600" /> {question} </header>
		{!collapsed && <div className="pb-4 flex flex-col">
			<input type="text" className={`border ${questionError ? "border-red-500" : "border-gray-300"} outline-none p-2 mt-3 mb-4 rounded-md`} value={question} maxLength={50} onChange={handleQuestionChange} placeholder="Add a Question: i.e. Do you translate to English as well?" />
			<textarea className={`border ${answerError ? "border-red-500" : "border-gray-300"} outline-none p-2 resize-none rounded-md h-24`} value={answer} maxLength={300} onChange={handleAnswerChange} placeholder="Add an Answer: i.e. Yes, I also translate from English to Hebrew." />
			<span className={`${answerError ? "text-red-600" : "text-gray-500"} text-right mt-2`}> {answer?.length} / 300 characters </span>
			<div className="justify-between flex mt-2">
				<button className="text-red-700" type="button" onClick={props.deleteFaq}> Delete </button>
				<div className="justify-between flex">
					<button type="button" className="bg-[#cececf] px-3 py-1 mr-4 font-semibold rounded-md" onClick={handleCancel}> Cancel </button>
					<button type="button" className="bg-[#222325] px-3 py-1 font-semibold rounded-md text-white" onClick={updateFaq}> Update </button>
				</div>
			</div>
		</div>}
	</div>;
}