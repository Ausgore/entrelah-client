import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode, useEffect, useState } from 'react';
import api from '@api';
import { useUser } from "@contexts/UserContext";
const stripePromise = loadStripe("pk_test_51NnHKDLBQ2JqxfdOjNLPRf0fVoRRLwnEoyTxqVX8dI9ls9A9GDYFnHytjL8OZOWIgcZpcqlvgUkHAraYRMDcqb6d00vvqISnXP");

interface StripeWrapperProps {
	amount: number;
	children: ReactNode;
}
export function StripeWrapper(props: StripeWrapperProps) {
	const user = useUser();
	const [clientSecret, setClientSecret] = useState<string | null>(null);

	useEffect(() => {
		if (props.amount) api.post(`stripe/create-payment-intent`, { amount: props.amount * 100, currency: user?.currency }).then(res => setClientSecret(res.data.client_secret));
	}, [props.amount]);

	return clientSecret && <Elements key={Date.now()} stripe={stripePromise} options={{ clientSecret }}>
		{props.children}
	</Elements>;
}