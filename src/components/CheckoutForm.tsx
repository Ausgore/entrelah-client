import { useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js';
import { FormEvent, RefObject } from "react";
import api from '@api';
import { useUser } from '@contexts/UserContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

interface CheckoutFormProps {
	package: any;
	submitRef: RefObject<HTMLButtonElement>;
	buttonRef: RefObject<HTMLButtonElement>;
}
export function CheckoutForm(props: CheckoutFormProps) {
	const stripe = useStripe();
	const elements = useElements();
	const user = useUser();
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const quantity = queryParams.get("quantity");

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!stripe || !elements) return;

		if (props.buttonRef.current) {
			props.buttonRef.current.innerText = "Processing...";
			props.buttonRef.current.disabled = true;
			props.buttonRef.current.style.backgroundColor = "#404145";
		}

		const result = await stripe.confirmPayment({ elements, redirect: "if_required" });
		
		if (result.error) {
			if (props.buttonRef.current) {
				props.buttonRef.current.innerText = "Confirm & Pay";
				props.buttonRef.current.disabled = false;
				props.buttonRef.current.style.backgroundColor = "black";
				props.buttonRef.current.addEventListener("mouseenter", () => {
					if (props.buttonRef.current) props.buttonRef.current.style.backgroundColor = "#404145";
				})
			}
		}
		else {
			const response = await api.post("order", { 
				customerId: user?.id, 
				packageId: id,
				paymentIntentId: result.paymentIntent.id,
				quantity: parseInt(quantity as string),
				title: props.package.title,
				description: props.package.description,
				deliveryDays: props.package.deliveryDays,
				price: props.package.price,
				revisions: props.package.revisions
			});
			navigate(`/orders/${response.data.id}/activities`);
		}
	}

	return <form onSubmit={handleSubmit}>
		<PaymentElement className="px-6 py-4 mb-4" />
		<button type="submit" ref={props.submitRef} />
	</form>
}