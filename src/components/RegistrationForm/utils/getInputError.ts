export default function getInputError(input: HTMLInputElement) {
	const error: { [key: string]: string } = {};
	let errorMessage = "";
	const { name, value } = input;
	if (name == "identifier") {
		if (!value) errorMessage = "Please enter your username/email";
		else if (value.includes("@") && !isEmail(value)) errorMessage = "Please provide a valid email address";
	}
	if (name == "username") {
		if (!value) errorMessage = "Please enter your username";
		else if (!/^[a-zA-Z].*/.test(value)) errorMessage = "Your username must begin with a letter and can include numbers and underscores";
		else if (value.length < 6) errorMessage = "That's too short. Your username must at least 6 characters";
	}
	if (name == "password") {
		if (!value) errorMessage = "Please enter your password";
		else if (value.length < 6) errorMessage = "Password must at least be 6 characters long";
	}
	if (name == "email") {
		if (!value || !isEmail(value)) errorMessage = "Looks like this email is incomplete";
	}
	error[input.name] = errorMessage;
	return error;
}

function isEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}