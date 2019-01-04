import * as React from 'react';
import { Col, Row } from '../../../assets/components/grid/index';
import { Icon } from 'office-ui-fabric-react';
import { observer } from 'mobx-react';
import './editable-list.scss';



@observer
export class ViewTextual extends React.Component<
	{
		text: string;
		index: number;
		all: string[];
		onChange: (newVal: string[]) => void;
	},
	{}
> {
	editElements: HTMLInputElement[] = [];
	render() {
		return (
			<input
				type="text"
				className="editViewItem"
				value={this.props.text}
				ref={(el) => (el ? (this.editElements[this.props.index] = el) : '')}
				onChange={() => {
					this.props.all[this.props.index] = this.editElements[this.props.index].value;
					this.props.onChange(this.props.all);
				}}
			/>
		);
	}
}

@observer
export class EditableList extends React.Component<
	{
		label: string;
		value: string[];
		onChange?: (newVal: string[]) => void;
		style?: any;
	},
	{}
> {
	inputElement: HTMLInputElement | undefined;

	addItem() {
		if (!this.inputElement) {
			return;
		}
		if (this.inputElement.value.replace(/\W/, '').length) {
			this.props.value.push(this.inputElement.value);
			this.inputElement.value = '';
			(this.props.onChange || (() => {}))(this.props.value);
		}
	}

	render() {
		return (
			<div className="editable-list-component" style={this.props.style}>
				<div className="editable-list">
					<div
						className="input"
						onClick={() => {
							if (!this.inputElement) {
								return;
							}
							this.inputElement.focus();
						}}
						style={this.props.value.length ? {} : { borderBottom: 'none' }}
					>
						<Row>
							<Col xs={20} sm={21}>
								<input
									className="input-field"
									placeholder={this.props.label}
									ref={(el) => (el ? (this.inputElement = el) : '')}
									onKeyDown={(keydown) => {
										if (keydown.keyCode === 13) {
											this.addItem();
										}
									}}
								/>
							</Col>
							<Col xs={4} sm={3} style={{ textAlign: 'right' }}>
								<Icon
									className="input-icon"
									iconName="Add"
									onClick={() => {
										this.addItem();
									}}
								/>
							</Col>
						</Row>
					</div>
					<div className="items">
						{this.props.value.map((item, key) => {
							const id = Math.random().toString(32).substr(3);
							return (
								<div key={key} id={id} className="item">
									<Row gutter={6}>
										<Col xs={20} sm={21}>
											<ViewTextual
												index={key}
												text={item}
												all={this.props.value}
												onChange={this.props.onChange || (() => {})}
											/>
										</Col>
										<Col xs={4} sm={3} style={{ textAlign: 'right' }}>
											<Icon
												className="delete"
												iconName="delete"
												onClick={async () => {
													this.props.value.splice(key, 1);
													(this.props.onChange || (() => {}))(this.props.value);
												}}
												onMouseEnter={() => {
													const el = document.getElementById(id);
													if (el) {
														el.className = el.className + ' toBeDeleted';
													}
												}}
												onMouseLeave={() => {
													const el = document.getElementById(id);
													if (el) {
														el.className = el.className.replace(' toBeDeleted', '');
													}
												}}
											/>
										</Col>
									</Row>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}
