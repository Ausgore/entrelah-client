import { useState } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';


export default function RegistrationForm() {
	const [isSignup, setIsSignup] = useState(false);

	return (
		<div className="flex">
			<LoginForm isSignup={isSignup} setIsSignup={setIsSignup} />
			<SignupForm isSignup={isSignup} setIsSignup={setIsSignup} />
		</div>
	);
}