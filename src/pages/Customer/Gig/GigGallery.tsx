import { FaRegImage, FaRegFilePdf } from "react-icons/fa";
import { useState, DragEvent, Dispatch, SetStateAction, ChangeEvent, useEffect, FormEvent, ReactNode } from 'react';
import { RiDeleteBin6Fill } from "react-icons/ri";
import api from '@api';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import { PiFilmReel } from "react-icons/pi";
import { IconType } from "react-icons";
import { useUser } from "@contexts/UserContext";
import { fileToBase64 } from "@/utils/fileToBase64";

export function GigGallery() {
	const user = useUser();
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const id = queryParams.get("id") as string;

	const [gigAttachments, setGigAttachments] = useState([]);

	useEffect(() => {
		api.get(`gig/${id}/attachments`).then(res => setGigAttachments(res.data));
	}, [id]);

	const [checkedError, setCheckedError] = useState(false);
	const [isChecked, setIsChecked] = useState(false);

	const [imageError, setImageError] = useState("");
	const [videoError, setVideoError] = useState("");
	const [documentError, setDocumentError] = useState("");

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!gigAttachments.filter((g: any) => g.type == 0)[0]) return setImageError("Please upload an image.");
		if (!isChecked) return setCheckedError(true);

		navigate(`/users/${user?.username}/manage_gigs/edit?tab=publish&id=${id}`);
	}

	const createAttachment = async (file: File, type: number) => {
		const base64Data = await fileToBase64(file);
		await api.post(`gig/${id}/attachment/create`, { type, attachment: { filename: file.name, filesize: file.size, contentType: file.type, base64Data } });
		const { data: attachments } = await api.get(`gig/${id}/attachments`);
		setGigAttachments(attachments);
	}

	const deleteAttachment = async (attachmentId: string) => {
		if (gigAttachments.filter((g: any) => g.type == 0).length < 2) return setImageError("You must have at least 1 image.");
		await api.delete(`gig/attachments/${attachmentId}`);
		const { data: attachments } = await api.get(`gig/${id}/attachments`);
		setGigAttachments(attachments);
	}

	const handleCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
		setIsChecked(e.target.checked);
		if (e.target.checked) setCheckedError(false);
	}

	return (
		<form onSubmit={handleSubmit}>
			<article className="py-4 mb-3">
				<h1 className="text-3xl font-semibold text-gray-600 mb-1"> Showcase Your Services In A Gig Gallery </h1>
				<h2 className="text-gray-800 text-lg mb-4"> Encourage buyers to choose your Gig by featuring a variety of your work. </h2>
				<hr className="border-gray-300" />
			</article>
			{/* Images */}
			<article>
				<div className="mb-6">
					<h1 className="text-xl font-bold text-gray-600 mb-1"> Images (up to 3) </h1>
					<h2 className="text-gray-500"> Get noticed by the right buyers with visual examples of your services. </h2>
				</div>
				<div className="flex gap-4 mb-4">
					<ImageInput attachment={gigAttachments.filter((g: any) => g.type == 0)[0]} createAttachment={createAttachment} deleteAttachment={deleteAttachment} setAttachmentError={setImageError} active={true} />
					<ImageInput attachment={gigAttachments.filter((g: any) => g.type == 0)[1]} createAttachment={createAttachment} deleteAttachment={deleteAttachment} setAttachmentError={setImageError} active={!(!gigAttachments.filter((g: any) => g.type == 0)[0])} />
					<ImageInput attachment={gigAttachments.filter((g: any) => g.type == 0)[2]} createAttachment={createAttachment} deleteAttachment={deleteAttachment} setAttachmentError={setImageError} active={!(!gigAttachments.filter((g: any) => g.type == 0)[1])} />
				</div>
				<div className="text-red-600 text-sm h-[1.5rem]"> {imageError} </div>
				<hr className="border-gray-300 mb-4" />
			</article>
			{/* Video */}
			<article>
				<div className="mb-6">
					<h1 className="text-xl font-bold text-gray-600 mb-1"> Video (one only) </h1>
					<h2 className="text-gray-500"> Capture buyers' attention with a video that showcases your service. </h2>
					<h3 className="text-gray-600 text-sm"> Please choose a video shorter than 75 seconds and smaller than 50MB </h3>
				</div>
				<div className="flex gap-4 mb-4">
					<VideoInput attachment={gigAttachments.filter((g: any) => g.type == 1)[0]} createAttachment={createAttachment} deleteAttachment={deleteAttachment} setAttachmentError={setVideoError} active={true} />
				</div>
				<div className="text-red-600 text-sm h-[1.5rem]"> {videoError} </div>
				<hr className="border-gray-300 mb-4" />
			</article>
			{/* PDF */}
			<article>
				<div className="mb-6">
					<h1 className="text-xl font-bold text-gray-600 mb-1"> Documents {"(up to 2)"} </h1>
					<h2 className="text-gray-500"> Show some of the best work you created in a document (PDFs only). </h2>
				</div>
				<div className="flex gap-4 mb-4">
					<DocumentInput attachment={gigAttachments.filter((g: any) => g.type == 2)[0]} createAttachment={createAttachment} deleteAttachment={deleteAttachment} setAttachmentError={setDocumentError} active={true} />
					<DocumentInput attachment={gigAttachments.filter((g: any) => g.type == 2)[1]} createAttachment={createAttachment} deleteAttachment={deleteAttachment} setAttachmentError={setDocumentError} active={!(!gigAttachments.filter((g: any) => g.type == 2)[0])} />
				</div>
				<div className="text-red-600 text-sm h-[1.5rem]"> {documentError} </div>
				<hr className="border-gray-300 mb-4" />
			</article>
			{/* Confirmation */}
			<div>
				<div className="flex mx-1 mb-1">
					<input type="checkbox" onChange={handleCheckChange} id="check" className="mr-4 w-6" />
					<label htmlFor="check" className="text-sm text-gray-600 cursor-pointer"> I declare that these materials were created by myself or by my team and do not infringe on any 3rd party rights. I understand that the illegal use of digital assets is against Entrelah's <Link to="/" className="text-gray-700 font-semibold"> Terms of Service </Link> and may result in blocking my account. </label>
				</div>
				{checkedError && <div className="text-red-600 text-sm h-[1.5rem]"> Please confirm that you've read and agreed to our Terms of Service </div>}
			</div>
			<div className="flex justify-end mt-12 mb-16">
				<button className="bg-[#222325] text-white font-bold text-lg py-[0.6rem] hover:bg-[#505256] px-4 rounded-md" type="submit"> Save & Continue </button>
			</div>
		</form>
	)
}

interface AttachmentInputProps {
	active?: boolean;
	attachment: any;
	children?: ReactNode;
	type: string;
	icon: IconType;
	handleAttachmentCreate: (file: File) => void;
	deleteAttachment: (attachmentId: string) => void;
}

function AttachmentInput(props: AttachmentInputProps) {
	const [isHovering, setIsHovering] = useState(false);

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const { files } = e.dataTransfer;
		if (files) props.handleAttachmentCreate(files[0]);
	}

	const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (files) props.handleAttachmentCreate(files[0]);
	}

	return props.attachment ? (
		<div className="bg-white h-36 w-72 relative" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
			{isHovering && <div className="absolute bg-[rgba(0,0,0,0.6)] p-[0.3rem] right-0 m-2 rounded-md cursor-pointer z-[9]" onClick={() => props.deleteAttachment(props.attachment.id)}> <RiDeleteBin6Fill size={18} className="text-white" /> </div>}
			{props.children}
		</div>
	) : (
		<div className={`bg-white h-36 w-72 flex flex-col justify-center items-center px-12 ${props.active ? "border border-dotted border-blue-300 hover:border-blue-500" : ""}`} onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
			{props.active && <>
				<props.icon size={45} className="text-gray-200" />
				<p className="text-gray-400 text-sm"> Drag & drop a {props.type} or </p>
				<label htmlFor="file">
					<span className="text-blue-500 cursor-pointer font-semibold text-[0.9rem]"> Browse </span>
					<input type="file" id="file" className="hidden" onChange={handleAttachmentChange} />
				</label>
			</>}
		</div>
	)
}

interface CreateAttachmentProps {
	active?: boolean;
	attachment: any;
	deleteAttachment: (attachmentId: string) => void;
	createAttachment: (file: File, type: number) => void;
	setAttachmentError: Dispatch<SetStateAction<string>>;
}
function ImageInput(props: CreateAttachmentProps) {
	const handleAttachmentCreate = async (file: File) => {
		if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) return props.setAttachmentError(`${file.name}: This file type is not supported. Please try one of the following: JPEG, JPG, PNG`);
		const { width, height } = await getImageDimensions(file);
		if (width < 712 || height < 430) return props.setAttachmentError(`${file.name}: The minimum image dimensions should be: 712 width and 430 height`);
		props.setAttachmentError("");
		props.createAttachment(file, 0);
	}

	return <AttachmentInput attachment={props.attachment} icon={FaRegImage} handleAttachmentCreate={handleAttachmentCreate} deleteAttachment={props.deleteAttachment} active={props.active} type="Photo">
		{props.attachment && <img
			src={URL.createObjectURL(new File([new Uint8Array(Buffer.from(props.attachment.attachment.data).buffer)], props.attachment.attachment.filename, { type: props.attachment.attachment.contentType }))}
			alt={props.attachment.attachment.filename}
			className="h-36 w-72"
		/>}
	</AttachmentInput>
}
function VideoInput(props: CreateAttachmentProps) {
	const handleAttachmentCreate = async (file: File) => {
		if (!["video/mp4"].includes(file.type)) return props.setAttachmentError(`${file.name}: This file type is not supported. Please try one of the following: MP4`);
		if ((file.size / 1_048_576) > 50) return props.setAttachmentError(`${file.name}: This file size is too large. Please make sure that it is less than 50MB`);
		const duration = await getVideoDuration(file);
		if (duration > 75) return props.setAttachmentError(`${file.name}: This file duration is too long. Please make sure that it is less than 75 seconds`);
		props.setAttachmentError("");
		props.createAttachment(file, 1);
	}

	return <AttachmentInput attachment={props.attachment} icon={PiFilmReel} handleAttachmentCreate={handleAttachmentCreate} deleteAttachment={props.deleteAttachment} active={props.active} type="Video">
		{props.attachment && <video controls className="h-36 w-72">
			<source
				src={URL.createObjectURL(new File([new Uint8Array(Buffer.from(props.attachment.attachment.data).buffer)], props.attachment.attachment.filename, { type: props.attachment.attachment.contentType }))}
				type={props.attachment.attachment.contentType}
			/>
		</video>}
	</AttachmentInput>
}
function DocumentInput(props: CreateAttachmentProps) {
	const handleAttachmentCreate = async (file: File) => {
		if (!["application/pdf"].includes(file.type)) return props.setAttachmentError(`${file.name}: This file type is not supported. Please try one of the following: PDF`);
		props.setAttachmentError("");
		props.createAttachment(file, 2);
	}

	return <AttachmentInput attachment={props.attachment} icon={FaRegFilePdf} handleAttachmentCreate={handleAttachmentCreate} deleteAttachment={props.deleteAttachment} active={props.active} type="PDF">
		{props.attachment && <embed
			src={URL.createObjectURL(new File([new Uint8Array(Buffer.from(props.attachment.attachment.data).buffer)], props.attachment.attachment.filename, { type: props.attachment.attachment.contentType }))}
			type="application/pdf"
			className="h-36 w-72"
		/>}
	</AttachmentInput>
}

const getImageDimensions = (file: File): Promise<{ width: number, height: number }> => {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve({ width: img.width, height: img.height });
		img.src = URL.createObjectURL(file);
	});
};

const getVideoDuration = (file: File): Promise<number> => {
	return new Promise((resolve) => {
		const video = document.createElement("video");
		video.addEventListener("loadedmetadata", () => resolve(video.duration));
		video.src = URL.createObjectURL(file);
	})
}