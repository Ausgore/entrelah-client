import CustomerNav from '@/components/CustomerNav/CustomerNav';
export function NotFound() {
	return (
		<>
			<CustomerNav />
			<div className="pt-52 bg-white overflow-hidden h-screen">
				<div className="container mx-auto">
					<div className="flex justify-center"> <img src="/404.webp" alt="404" className="w-[46rem]" /> </div>
					<div className="text-center mx-2">
						<h1 className="text-3xl font-semibold mb-2"> Well, this isn't what you're looking for </h1>
						<h2 className="text-xl"> Unfortunately, the page you're looking for has been moved or deleted </h2>
					</div>
				</div>
			</div>
		</>
	);
}