import React from 'react';
import DialogContainer from 'react-md/lib/Dialogs/DialogContainer';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import Button from 'react-md/lib/Buttons/Button';

import { withT } from '@src/lib/i18n';
import { ComponentProps } from './types';

import './Dialog.scss';

const Dialog = (props: ComponentProps) => {

	const { id, icon, title, content, onAccept, onAcceptText, onCancel, onCancelText } = props;

	const centerButtons = (!onAccept && onCancel) || (onAccept && !onCancel) ? "center-buttons" : "";
	const footerClassName = `dialog-footer md-grid ${centerButtons}`;

	const actions = [];
	if (onCancel) actions.push(<Button id="react-baseDialogCancelBtn" className="btn--grey btn--no-background" flat onClick={onCancel}>{onCancelText}</Button>);
	if (onAccept) actions.push(<Button id="react-baseDialogAcceptBtn" className="btn--green btn--no-background" flat onClick={onAccept}>{onAcceptText}</Button>);

	const dialogHeader = (
		<>
			<div className="dialog-close">
				{onCancel ? <Button id="react-baseDialogClosBtn" className="btn--no-background" flat onClick={onCancel}><FontIcon>clear</FontIcon></Button> : null}
			</div>
			<div className="dialog-header md-grid">
				{icon ? <div className="dialog-logo">{icon}</div> : null}
				<div className="dialog-title">{title}</div>
			</div>
		</>
	);

	const dialogContent = (
		<div className="dialog-container">
			<div className="dialog-content">{content}</div>
		</div>
	);

	return <DialogContainer
		id={id}
		className="react-base-dialog"
		visible={true}
		onHide={() => {
			if (onCancel) onCancel();
			else if (onAccept) onAccept();
		}}
		focusOnMount={false}
		aria-labelledby="react-base-dialog"
		title={dialogHeader}
		children={dialogContent}
		footerClassName={footerClassName}
		actions={actions}
	/>;
};

export default withT(Dialog);
