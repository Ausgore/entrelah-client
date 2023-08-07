import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { Suspense } from 'react';
import { UserProvider } from './contexts/UserContext';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
	return (
		<UserProvider>
			<BrowserRouter>
				<Suspense fallback={<h1> Loading... </h1>}>
					<Routes>
						<Route path="/" index element={<Home />} />
						<Route path="/404" element={<NotFound />} />
						<Route path="/:username" element={<Profile />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Suspense>
			</BrowserRouter>
		</UserProvider>
	);
}