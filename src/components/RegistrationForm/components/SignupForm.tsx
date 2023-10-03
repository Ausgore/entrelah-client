import { Dispatch, FormEvent, SetStateAction, useState } from 'react';

import api from '@api';
import Button from '@/components/RegistrationForm/components/FormBuilder/Button';

import { FormInput, FormBody, FormHeader, FormFooter } from './FormBuilder';
import hasErrors from '../utils/hasErrors';
import getInputError from '../utils/getInputError';
import { useUserUpdate } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

interface SignupFormProps {
	isSignup: boolean;
	setIsSignup: Dispatch<SetStateAction<boolean>>;
}
export default function SignupForm(props: SignupFormProps) {
	const navigate = useNavigate();
	const updateUser = useUserUpdate();
	const [email, setEmail] = useState<string>();
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isSecondPage, setIsSecondPage] = useState(false);
	
	const viewLogin = () => {
		props.setIsSignup(false);
		setIsSecondPage(false);
	}

	async function handleFirstSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const inputs = [...event.currentTarget.getElementsByTagName("input")];
		inputs.forEach(input => setErrors(prev => ({ ...prev, ...getInputError(input) })));

		if (!hasErrors(errors)) {
			const [email] = inputs.map(i => i.value);
			const response = await api.get(`/user?email=${email}`).catch(() => null);
			if (response?.data.length) return setErrors({ ...errors, email: "Sorry, this email can't be registered. Please try another one." });
			setEmail(email);
			setIsSecondPage(true);
		}
	}

	async function handleSecondSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const inputs = [...event.currentTarget.getElementsByTagName("input")];
		inputs.forEach(input => setErrors(prev => ({ ...prev, ...getInputError(input) })));

		if (!hasErrors(errors)) {
			const [username, password] = inputs.map(i => i.value);
			let response = await api.get(`/user?username=${username}`).catch(() => null);
			if (response?.data.length) return setErrors({ ...errors, username: "Looks like this username is already taken. Please pick another one." });
			
			response = await api.post(`/user`, { username, password, email }).catch(() => null);
			if (response) {
				updateUser({ id: response.data.id, username: response.data.username, wallet: response.data.wallet, currency: response.data.currency, email: response.data.email, avatar: response.data.avatar });
				navigate("/");
			}
		}
	}


	return (
		<>
			<FormBody className={props.isSignup ? isSecondPage ? "hidden" : "" : "hidden"} onSubmit={handleFirstSubmit}>
				<FormHeader> Join Estrelah </FormHeader>
				<FormInput name="email" errors={errors} className="w-80 mt-2" placeholder="Enter your email" />
				<Button className="w-full mt-7"> Continue </Button>
				<FormFooter>
					<p className="text-sm font-medium text-gray-700"> Already a member?
						<span className="text-red-500 cursor-pointer" onClick={viewLogin}> Sign In </span>
					</p>
				</FormFooter>
			</FormBody>
			<FormBody className={props.isSignup ? isSecondPage ? "" : "hidden" : "hidden"} onSubmit={handleSecondSubmit}>
				<FormHeader> Join Estrelah </FormHeader>
				<FormInput name="username" errors={errors} className="w-80 mt-2" placeholder="Choose a Username" />
				<FormInput name="password" errors={errors} className="w-full mt-4" placeholder="Choose a Password" />
				<Button className="w-full mt-7" type="submit"> Continue </Button>
				<FormFooter>
					<p className="text-sm font-medium text-gray-700"> Already a member?
						<span className="text-red-500 cursor-pointer" onClick={viewLogin}> Sign In </span>
					</p>
				</FormFooter>
			</FormBody>
		</>
	);
}