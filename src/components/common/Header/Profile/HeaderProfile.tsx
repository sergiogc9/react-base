import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import theme from '@sergiogc9/react-ui-theme';
import { Avatar, Box, Button } from '@sergiogc9/react-ui';
import { UserMenu } from '@sergiogc9/react-ui-collections';

import Responsive from 'components/common/Responsive';
import authManager from 'lib/auth';
import selectors from 'store/auth/selectors';

const HeaderProfile: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const user = useSelector(selectors.getUserProfile)!;

	const [isUserMenuVisible, setIsUserMenuVisible] = React.useState(false);
	const avatarRef = React.useRef<HTMLAnchorElement>(null);

	const fullName = `${user.name} ${user.surnames}`;

	const onNavigateTo = React.useCallback(
		(url: string) => {
			setIsUserMenuVisible(false);
			navigate(url);
		},
		[navigate]
	);

	const onCloseUserMenu = React.useCallback(() => {
		setIsUserMenuVisible(false);
	}, []);

	return (
		<Box mr={3} ml="auto">
			<Box cursor="pointer" ref={avatarRef} onClick={() => setIsUserMenuVisible(isVisible => !isVisible)}>
				<Avatar
					aspectSize="s"
					data-testid="headerProfileAvatar"
					src="https://pm1.narvii.com/6113/9a39994445554f5b0700dd8317a3efb172ff5dba_hq.jpg"
				>
					{fullName}
				</Avatar>
			</Box>
			<UserMenu
				boxShadow="down"
				data-testid="headerProfileUserDropdownMenu"
				isInteractive
				isVisible={isUserMenuVisible}
				minWidth="210px"
				onClose={onCloseUserMenu}
				placement="bottom-end"
				reference={avatarRef}
				skidding={theme.space[3]}
			>
				<UserMenu.Title>{fullName}</UserMenu.Title>
				<UserMenu.Item onClick={() => onNavigateTo('/profile')}>
					<UserMenu.Item.Icon icon="user-circle" styling="outlined" />
					<UserMenu.Item.Text>User settings</UserMenu.Item.Text>
				</UserMenu.Item>
				<UserMenu.Item onClick={() => onNavigateTo('/notifications')}>
					<UserMenu.Item.Icon icon="bell" styling="outlined" />
					<UserMenu.Item.Text>Notifications</UserMenu.Item.Text>
				</UserMenu.Item>
				<Responsive visibility={['md', 'lg', 'xl']}>
					<UserMenu.Footer onClick={authManager.doLogout}>
						<UserMenu.Item>
							<UserMenu.Item.Icon fill="neutral.700" icon="logout" styling="outlined" />
							<UserMenu.Item.Text color="neutral.700">{t('general.logout')}</UserMenu.Item.Text>
						</UserMenu.Item>
					</UserMenu.Footer>
				</Responsive>
				<Responsive visibility="mobile">
					<UserMenu.Footer>
						<Button mb={1} mt={2} mx={1} onClick={authManager.doLogout} variant="secondary" width="100%">
							{t('general.logout')}
						</Button>
					</UserMenu.Footer>
				</Responsive>
			</UserMenu>
		</Box>
	);
};

export default React.memo(HeaderProfile);
