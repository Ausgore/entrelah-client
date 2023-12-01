import CustomerNav from "@/components/CustomerNav/CustomerNav";
import RegistrationForm from "@components/RegistrationForm";
export function Login() {
	return (
		<>
			<CustomerNav />
			<div className="pt-56 container mx-auto flex justify-center items-center">
				<RegistrationForm />
			</div>
		</>
	)
}