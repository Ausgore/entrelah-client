import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Suspense } from 'react';
import { UserProvider } from './contexts/UserContext';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';
import { GigBuilder } from './pages/Customer/Gig/GigBuilder';
import { ManageGigs } from './pages/Customer/Gig/ManageGigs';
import { Gig } from './pages/Customer/Gig/Gig';
import { Payment } from './pages/Customer/Payment';
import { Order } from './pages/Order/Order';
import { ManageOrders } from "./pages/Order/ManageOrders";
import { Inbox } from "./pages/Inbox";
import { Search } from "./pages/Search";

export default function App() {
	return (
		<UserProvider>
			<BrowserRouter>
				<Suspense fallback={<h1> Loading... </h1>}>
					<Routes>
						<Route path="/" index element={<Home />} />
						<Route path="*" element={<NotFound />} />
						<Route path="/404" element={<NotFound />} />

						<Route path="/categories/:category/:subcategory" element={<Search />} />
						<Route path="/search" element={<Search />} />

						<Route path="/inbox/:username?" element={<Inbox />} />

						<Route path="/orders/:id/*" element={<Order />} />

						<Route path="/payments/:id" element={<Payment />} />

						<Route path="/users/:username" element={<Profile />} />
						<Route path="/users/:username/manage_orders" element={<ManageOrders />} />
						<Route path="/users/:username/seller_dashboard" element={<Profile />} />
						<Route path="/users/:username/:gigId" element={<Gig />} />
						<Route path="/users/:username/manage_gigs" element={<ManageGigs />} />
						<Route path="/users/:username/manage_gigs/create" element={<GigBuilder />} />
						<Route path="/users/:username/manage_gigs/edit" element={<GigBuilder />} />
					</Routes>
				</Suspense>
			</BrowserRouter>
		</UserProvider>
	);
}