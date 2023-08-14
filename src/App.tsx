import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Suspense } from 'react';
import { UserProvider } from './contexts/UserContext';
import { Profile } from './pages/User/Profile';
import { NotFound } from './pages/NotFound';
import { GigBuilder } from './pages/User/Gig/GigBuilder';
import { ManageGigs } from './pages/User/Gig/ManageGigs';

export default function App() {
	return (
		<UserProvider>
			<BrowserRouter>
				<Suspense fallback={<h1> Loading... </h1>}>
					<Routes>
						<Route path="/" index element={<Home />} />
						<Route path="*" element={<NotFound />} />
						<Route path="/404" element={<NotFound />} />

						<Route path="/users/:username" element={<Profile />} />
						<Route path="/users/:username/manage_gigs" element={<ManageGigs />} />
						<Route path="/users/:username/manage_gigs/create" element={<GigBuilder />} />
						<Route path="/users/:username/manage_gigs/edit" element={<GigBuilder />} />
					</Routes>
				</Suspense>
			</BrowserRouter>
		</UserProvider>
	);
}