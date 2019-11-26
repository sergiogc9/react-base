import React from 'react';
import DialogContainer from 'react-md/lib/Dialogs/DialogContainer';
import Button from 'react-md/lib/Buttons/Button';

import { withT } from '@src/lib/i18n';
import { ComponentProps } from './types';

import './SimpleDialog.scss';

const SimpleDialog = (props: ComponentProps) => {

	const { id, text, content, onAccept, onAcceptText, onCancel, onCancelText } = props;

	const centerButtons = (!onAccept && onCancel) || (onAccept && !onCancel) ? "center-buttons" : "";
	const footerClassName = `dialog-footer md-grid ${centerButtons}`;

	const dialogContent = (
		<div className="dialog-container">
			<div className="dialog-header md-grid">
				<div className="dialog-text">{text}</div>
			</div>
			<div className="dialog-content">{content}</div>
			<div className={footerClassName}>
				{onCancel ? <Button id="launchmetricsDialogCancelBtn" className="btn--grey btn--no-background" flat onClick={onCancel}>{onCancelText}</Button> : null}
				{onAccept ? <Button id="launchmetricsDialogAcceptBtn" className="btn--green btn--no-background" flat onClick={onAccept}>{onAcceptText}</Button> : null}
			</div>
		</div>
	);

	return <DialogContainer
		id={id}
		className="launchmetrics-simple-dialog"
		visible={true}
		onHide={onCancel ? onCancel : () => { }}
		focusOnMount={false}
		aria-labelledby="launchmetrics-dialog"
		children={dialogContent}
	/>;
};

export default withT(SimpleDialog);
