import CustomerNav from "@components/CustomerNav/CustomerNav";
import { useEffect } from "react";
export function Search() {
	useEffect(() => {
		document.body.style.backgroundColor = "white";
		return () => {
			document.body.style.backgroundColor = "#f0f2f5";
		}
	}, []);

	return (
		<>
			<CustomerNav />
		</>
	)
}