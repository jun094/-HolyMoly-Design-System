import React, { useState } from 'react';
import base, { filename } from 'paths.macro';
import { text, boolean } from '@storybook/addon-knobs';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import DashboardFrame from '../components/DashboardFrame';

import { Button } from 'reactstrap';
import { ButtonDropdown } from 'reactstrap';
import { DropdownToggle } from 'reactstrap';
import { DropdownMenu } from 'reactstrap';
import { DropdownItem } from 'reactstrap';

import { Nav } from 'reactstrap';
import { NavItem } from 'reactstrap';
import { NavLink } from 'reactstrap';

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
			display: 'flex',
			justifyContent: 'flex-end',
			width: '100%',
		},
		Button: {
			marginLeft: '0.5rem',
		},
	};
	return (
		<div style={style.Wrapper}>
			<Button size="sm" color="link">
				BUTTON
			</Button>
			<Button style={style.Button} size="sm" color="link">
				BUTTON
			</Button>
			<Button style={style.Button} size="sm" color="link">
				BUTTON
			</Button>
		</div>
	);
};
const ExampleChildrenSidebar = () => {
	// TODO : 아래 bootstrap override하는 css들은 추후, goormstrap을 수정할 예정
	const style = {
		Nav: {
			padding: '12px 0',
			width: '100%',
		},
		NavItem: {
			margin: 0,
		},
		NavLink: {
			padding: '0.3125rem 1.5rem',
			borderRadius: 0,
		},
	};
	return (
		<Nav vertical style={style.Nav}>
			<NavItem style={style.NavItem}>
				<NavLink style={style.NavLink}>SIDE MENU</NavLink>
			</NavItem>
			<NavItem style={style.NavItem}>
				<NavLink style={style.NavLink}>SIDE MENU</NavLink>
			</NavItem>
			<NavItem style={style.NavItem}>
				<NavLink style={style.NavLink}>SIDE MENU</NavLink>
			</NavItem>
			<NavItem style={style.NavItem}>
				<NavLink style={style.NavLink}>SIDE MENU</NavLink>
			</NavItem>
		</Nav>
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
							<h3>Settings</h3>
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
