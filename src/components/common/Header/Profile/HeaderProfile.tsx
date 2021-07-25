import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import theme from '@sergiogc9/react-ui-theme';
import { Avatar, Box, Button } from '@sergiogc9/react-ui';

import authManager from 'lib/auth';
import selectors from 'store/auth/selectors';
import DropdownMenu from 'components/ui/DropdownMenu';

const HeaderProfile: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const user = useSelector(selectors.getUserProfile)!;

	const [isUserDropdownMenuVisible, setIsUserDropdownMenuVisible] = React.useState(false);
	const avatarRef = React.useRef<HTMLAnchorElement>(null);

	const onGoToPath = React.useCallback(
		(path: string) => {
			setIsUserDropdownMenuVisible(false);
			// eslint-disable-next-line no-alert
			alert('Not implemented');
			navigate(path);
		},
		[navigate]
	);

	const fullName = `${user.name} ${user.surnames}`;

	return (
		<Box mr={3} ml="auto">
			<Box cursor="pointer" ref={avatarRef} onClick={() => setIsUserDropdownMenuVisible(isVisible => !isVisible)}>
				<Avatar
					aspectSize="s"
					data-testid="headerProfileAvatar"
					src="https://pm1.narvii.com/6113/9a39994445554f5b0700dd8317a3efb172ff5dba_hq.jpg"
				>
					{fullName}
				</Avatar>
			</Box>
			<DropdownMenu
				boxShadow="down"
				data-testid="headerProfileUserDropdownMenu"
				isInteractive
				isVisible={isUserDropdownMenuVisible}
				minWidth="210px"
				placement="bottom-end"
				reference={avatarRef}
				skidding={theme.space[3]}
				tippyProps={{ onClickOutside: () => setIsUserDropdownMenuVisible(false) }}
				trigger="click"
			>
				<DropdownMenu.Title>{fullName}</DropdownMenu.Title>
				<DropdownMenu.Item onClick={() => onGoToPath('/profile')}>
					<DropdownMenu.Item.Icon icon="user-circle" styling="outlined" />
					<DropdownMenu.Item.Text>User settings</DropdownMenu.Item.Text>
				</DropdownMenu.Item>
				<DropdownMenu.Item onClick={() => onGoToPath('/notifications')}>
					<DropdownMenu.Item.Icon icon="bell" styling="outlined" />
					<DropdownMenu.Item.Text>Notifications</DropdownMenu.Item.Text>
				</DropdownMenu.Item>
				<DropdownMenu.Footer justifyContent="flex-end">
					<Button aspectSize="s" variant="link" onClick={authManager.doLogout}>
						{t('general.logout')}
					</Button>
				</DropdownMenu.Footer>
			</DropdownMenu>
		</Box>
	);
};

export default React.memo(HeaderProfile);
