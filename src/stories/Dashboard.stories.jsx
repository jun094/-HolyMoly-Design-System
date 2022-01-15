import React, { useState } from 'react';
import base, { filename } from 'paths.macro';
import { text, boolean } from '@storybook/addon-knobs';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import DashboardFrame from '../components/DashboardFrame';

import { Button } from 'reactstrap';

import { Card } from 'reactstrap';
import { CardHeader } from 'reactstrap';
import { CardBody } from 'reactstrap';

export default {
	title: `${base.split('/src/stories/').join('')}${filename}`,
	component: DashboardFrame,
	subcomponents: [
		DashboardFrame.NavBar,
		DashboardFrame.Body,
		DashboardFrame.SideNav,
		DashboardFrame.Content,
		DashboardFrame.ContentHeader,
	],
	parameters: {
		viewport: {
			viewports: INITIAL_VIEWPORTS,
			defaultViewport: 'responsive',
		},
	},
	decorators: [
		(story) => (
			<div
				style={{
					position: 'relative',
					margin: '-1rem',
				}}
			>
				{story()}
			</div>
		),
	],
};

// *** DashboardFrame Children ComponentsExample
const ExampleChildrenNavbar = () => {
	const style = {
		Wrapper: {
			width: '100%',
		},
		Button: {
			marginLeft: '0.5rem',
		},
	};
	return (
		<div style={style.Wrapper} className="d-flex justify-content-end">
			<Button size="sm" color="secondary">
				BUTTON
			</Button>
			<Button style={style.Button} size="sm" color="secondary">
				BUTTON
			</Button>
			<Button style={style.Button} size="sm" color="secondary">
				BUTTON
			</Button>
		</div>
	);
};
const ExampleChildrenSidebar = () => {
	const style = {
		Button: {
			margin: '0.5rem',
		},
	};

	return (
		<div className="d-flex flex-column">
			<Button  style={style.Button}size="sm" color="light">
				Link 1
			</Button>
			<Button  style={style.Button}size="sm" color="light">
				Link 2
			</Button>
			<Button  style={style.Button}size="sm" color="light">
				Link 3
			</Button>
		</div>
	);
};

// *** DashboardFrame Template
const Template = (args) => {
	const { maxWidth } = args;
	const maxWidthStyle = maxWidth || text('Content.maxWidth', '71.25rem');

	return (
		<div>
			<DashboardFrame
				isResizeable={boolean('DashboardFramd.isResizeable', true)}
			>
				<DashboardFrame.NavBar>
					<ExampleChildrenNavbar />
				</DashboardFrame.NavBar>
				<DashboardFrame.Body>
					<DashboardFrame.SideNav
						divider={boolean('SideNav.divider', true)}
					>
						<ExampleChildrenSidebar />
					</DashboardFrame.SideNav>
					<DashboardFrame.Content
						maxWidth={maxWidthStyle}
						minWidth={text('Content.minWidth', 'unset')}
					>
						<DashboardFrame.ContentHeader>
							<h3>Content</h3>
						</DashboardFrame.ContentHeader>
						<Card>
							<CardHeader>Content#1 Header</CardHeader>
							<CardBody>Content#1</CardBody>
						</Card>
						<Card>
							<CardBody>Content#2</CardBody>
						</Card>
					</DashboardFrame.Content>
				</DashboardFrame.Body>
			</DashboardFrame>
		</div>
	);
};

// *** DashboardFrame Stories
export const Basic = Template.bind({});

export const UnsetMaxWidth = Template.bind({});
UnsetMaxWidth.args = {
	maxWidth: 'unset',
};

export const Tablet = Template.bind({});
Tablet.args = {
	width: '768px',
};
Tablet.parameters = {
	viewport: {
		defaultViewport: 'ipad',
	},
};

export const Mobile = Template.bind({});
Mobile.args = {
	width: '375px',
};
Mobile.parameters = {
	viewport: {
		defaultViewport: 'iphonex',
	},
};
