import React from 'react';
import { Outlet } from 'react-router-dom';

import usePageIsScrolled from 'lib/hooks/usePageIsScrolled';
import FallbackLoader from 'components/common/FallbackLoader';
import Header from 'components/common/Header';
import Sidebar from 'components/common/Sidebar';
import StyledMainLayout from './styled';

const MainLayout: React.FC = () => {
	const mainContentRef = React.useRef(null);
	usePageIsScrolled(mainContentRef);

	return (
		<StyledMainLayout id="mainLayout">
			<Header />
			<Sidebar />
			<main ref={mainContentRef}>
				<React.Suspense fallback={<FallbackLoader />}>
					<Outlet />
				</React.Suspense>
			</main>
		</StyledMainLayout>
	);
};

export default MainLayout;
