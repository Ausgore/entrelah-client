import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '@api';
import Button from '@/components/RegistrationForm/components/FormBuilder/Button';
import { useUserUpdate } from '@contexts/UserContext';

import { FormInput, FormBody, FormHeader, FormFooter } from './FormBuilder';
import hasErrors from '../utils/hasErrors';
import getInputError from '../utils/getInputError';

interface LoginFormProps {
	isSignup: boolean;
	setIsSignup: Dispatch<SetStateAction<boolean>>;
}

export default function LoginForm(props: LoginFormProps) {
	const navigate = useNavigate();
	const updateUser = useUserUpdate();
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const viewSignup = () => props.setIsSignup(true);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const inputs = [...event.currentTarget.getElementsByTagName("input")];
		inputs.forEach(input => setErrors(prev => ({ ...prev, ...getInputError(input) })));

		if (!hasErrors(errors)) {
			const [identifier, password] = inputs.map(i => i.value);
			const response = await api.post(`/user/authenticate`, { identifier, password }).catch(() => null);
			if (!response) return setErrors({ identifier: "Invalid username/email", password: "Invalid password" });
			const { data } = response;
			updateUser({ id: data.id, username: data.username, email: data.email, wallet: data.wallet, currency: data.currency, avatar: data.avatar });
			navigate("/");
		}
	}

	return (
		<FormBody className={!props.isSignup ? "" : "hidden"} onSubmit={handleSubmit}>
			<FormHeader> Sign In To Estrelah </FormHeader>
			<FormInput name="identifier" errors={errors} className="mt-2" placeholder="Email / Username" />
			<FormInput name="password" errors={errors} className="mt-4" placeholder="Password" />
			<Button className="w-full mt-7" type="submit"> Continue </Button>
			<FormFooter>
				<p className="text-sm font-medium text-gray-700"> Not a member yet?
					<span className="text-red-500 cursor-pointer" onClick={viewSignup}> Join now </span>
				</p>
			</FormFooter>
		</FormBody>
	);
}
