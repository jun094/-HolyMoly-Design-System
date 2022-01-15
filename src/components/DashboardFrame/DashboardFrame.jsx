import React, {
	useState,
	useRef,
	useEffect,
	createContext,
	useContext,
} from 'react';

import cx from 'classnames';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import { ReactComponent as ChevronLeftIcon } from '../icons/ChevronLeftIcon.svg';
import Logo from '../icons/Logo.svg';

import style from './DashboardFrame.module.scss';

// 이거 변경되면, scss 변수도 함께 변경해주기
const DASHBOARD_BREAKPOINT_TABLET = 992;

const SIDE_NAV_WIDTH = 300;
const SIDE_NAV_MIN_WIDTH = 240;
const SIDE_NAV_MAX_WIDTH = 400;

const CONTET_MAX_WIDTH = '71.25rem'; // 1140px
const CONTET_MIN_WIDTH = 'unset';

const DashboardContext = createContext();
const useDashboardContext = () => useContext(DashboardContext);

// *** 기본 폼 예시 ***
// <DashboardFrame>
// 	<NavBar>NavBar</NavBar>
// 	<Body>
// 		<SideNav>
// 			SideNav
// 		</SideNav>
// 		<Content>
// 			<ContentHeader>ContentHeader<ContentHeader>
// 			Content
// 		</Content>
// 	</Body>
// </DashboardFrame>

const NavBar = ({ children, className, innerClassName }) => {
	const { logoSrc, sideNavState, setSideNavState } = useDashboardContext();

	const handleIcon = () => {
		if (sideNavState === 'open') {
			setSideNavState('close');
		} else {
			setSideNavState('open');
		}
	};

	return (
		<header className={cx(style.NavBar, className)}>
			<div className={cx(style.NavBar__inner, innerClassName)}>
				<span
					className={style.NavBar__iconWrapper}
					onClick={handleIcon}
				>
					<span className={style.HambugerIcon}>
						<span
							className={cx(
								style.HambugerIcon__line,
								style['HambugerIcon__line--top'],
								sideNavState === 'open' &&
									style['HambugerIcon__line--topActive'],
							)}
						/>
						<span
							className={cx(
								style.HambugerIcon__line,
								style['HambugerIcon__line--bottom'],
								sideNavState === 'open' &&
									style['HambugerIcon__line--bottomActive'],
							)}
						/>
					</span>
				</span>
				<img className={style.NavBar__logo} src={Logo} alt=" logo" />
				{children}
			</div>
		</header>
	);
};

const Body = ({ children, className }) => (
	<div className={cx(style.Body, className)}>{children}</div>
);

const SideNav = ({ children, divider, className, innerClassName }) => {
	const {
		sideNavState,
		setSideNavState,
		isResizeable,
		sideNavRef,
		resizeRef,
	} = useDashboardContext();
	const iconLeftRef = useRef(null);

	const closeStyle = {
		flexBasis: '1rem',
	};

	useEffect(() => {
		if (!iconLeftRef) return;

		const handleLeaveMouse = () => {
			setSideNavState('close');
		};
		const handleEnterMouse = () => {
			setSideNavState('absolute');
		};
		const handleRemoveMouseEvent = () => {
			sideNavRef.current.removeEventListener(
				'mouseenter',
				handleEnterMouse,
			);
			sideNavRef.current.removeEventListener(
				'mouseleave',
				handleLeaveMouse,
			);
		};
		const handleSideNav = () => {
			const isOpened = Array.from(sideNavRef.current.classList).includes(
				style['SideNav--open'],
			);

			if (isOpened) {
				setSideNavState('close');
				sideNavRef.current.addEventListener(
					'mouseenter',
					handleEnterMouse,
				);
				sideNavRef.current.addEventListener(
					'mouseleave',
					handleLeaveMouse,
				);
			} else {
				setSideNavState('open');
				handleRemoveMouseEvent();
			}
		};
		const handleResize = debounce(() => {
			if (window.innerWidth <= DASHBOARD_BREAKPOINT_TABLET) {
				setSideNavState('close');
			} else {
				setSideNavState('open');
			}

			handleRemoveMouseEvent();
		}, 400);

		// sideNave collapse를 위한 event
		iconLeftRef.current.addEventListener('click', handleSideNav);

		// 창 크기 변경 감지를 위한 event
		window.addEventListener('resize', handleResize);

		return () => {
			iconLeftRef.current.removeEventListener('click', handleSideNav);
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<aside
			ref={sideNavRef}
			className={cx(
				style.SideNav,
				style[`SideNav--${sideNavState}`],
				divider && style.SideNav__divideBorder,
				className,
			)}
			style={sideNavState === 'close' ? closeStyle : null}
		>
			<div className={cx(style.SideNav__inner, innerClassName)}>
				{children}
			</div>

			{isResizeable && (
				<div
					ref={resizeRef}
					className={cx(
						style.SideNav__resizeBorder,
						sideNavState === 'absolute' &&
							style['SideNav__resizeBorder--absolute'],
					)}
				>
					<span className={style['SideNav__resizeBorder--vr']} />
					<span
						ref={iconLeftRef}
						className={cx(
							style.SideNav__icon,
							sideNavState === 'absolute' &&
								style['SideNav__icon--right'],
						)}
					>
						<ChevronLeftIcon width="1.5rem" height="1.5rem" />
					</span>
				</div>
			)}
		</aside>
	);
};

const Content = ({
	children,
	className,
	innerClassName,
	maxWidth,
	minWidth,
}) => {
	const { sideNavState, contentRef } = useDashboardContext();
	const openStyle = {
		flexBasis: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
	};

	return (
		<section
			style={sideNavState === 'open' ? openStyle : null}
			ref={contentRef}
			className={cx(style.Content, className)}
		>
			<div
				className={cx(style.Content__inner, innerClassName)}
				style={{ maxWidth, minWidth }}
			>
				{children}
			</div>
		</section>
	);
};

// *** 일단은 children으로 받고 디자인이 더 정형화되면 props 로 구현
const ContentHeader = ({ children, className }) => (
	<div className={cx(style.ContentHeader, className)}>{children}</div>
);

const DashboardFrame = ({ logoSrc, children, className, isResizeable }) => {
	const [sideNavState, setSideNavState] = useState('open');

	const frameRef = useRef(null);
	const sideNavRef = useRef(null);
	const resizeRef = useRef(null);
	const contentRef = useRef(null);

	const x = useRef(0);
	const w = useRef(0);

	const handleMouseMove = (e) => {
		const dx = e.clientX - x.current;
		const calcSideNavWidth = w.current + dx;

		// min-width, max-width 를 벗어나면 연산 작업 x
		if (
			calcSideNavWidth < SIDE_NAV_MIN_WIDTH ||
			calcSideNavWidth > SIDE_NAV_MAX_WIDTH
		)
			return;

		sideNavRef.current.style.flexBasis = `${calcSideNavWidth}px`;
		contentRef.current.style.flexBasis = `calc(100% - ${calcSideNavWidth}px)`;
	};
	const handleMouseUp = () => {
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	};
	const handleMouseDown = (e) => {
		const styles = window.getComputedStyle(sideNavRef.current);

		// SideNave 'absolute' 일 때는 창 조절 x
		if (styles.position === 'absolute') return;

		x.current = e.clientX;
		w.current = parseInt(styles.width, 10);

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	useEffect(() => {
		if (window.innerWidth <= DASHBOARD_BREAKPOINT_TABLET) {
			setSideNavState('close');
		}
		if (isResizeable)
			resizeRef.current.addEventListener('mousedown', handleMouseDown);
	}, []);

	const contextValue = {
		logoSrc,
		sideNavState,
		setSideNavState,
		sideNavRef,
		resizeRef,
		contentRef,
		isResizeable,
	};

	return (
		<DashboardContext.Provider value={contextValue}>
			<div
				ref={frameRef}
				className={cx(
					style.DashboardFrame,
					sideNavState === 'open'
						? style['DashboardFrame--open']
						: style['DashboardFrame--close'],
					className,
				)}
			>
				{children}
			</div>
		</DashboardContext.Provider>
	);
};

NavBar.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	innerClassName: PropTypes.string,
};
NavBar.defaultProps = {
	children: null,
	className: '',
	innerClassName: '',
};

Body.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
};
Body.defaultProps = {
	children: null,
	className: '',
};

SideNav.propTypes = {
	children: PropTypes.node,
	divider: PropTypes.bool,
	className: PropTypes.string,
	innerClassName: PropTypes.string,
};
SideNav.defaultProps = {
	children: null,
	divider: true,
	className: '',
	innerClassName: '',
};

Content.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	innerClassName: PropTypes.string,
	minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
Content.defaultProps = {
	children: null,
	className: '',
	innerClassName: '',
	minWidth: CONTET_MIN_WIDTH,
	maxWidth: CONTET_MAX_WIDTH,
};

ContentHeader.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
};
ContentHeader.defaultProps = {
	children: null,
	className: '',
};

DashboardFrame.propTypes = {
	logoSrc: PropTypes.string,
	children: PropTypes.node,
	className: PropTypes.string,
	isResizeable: PropTypes.bool,
};
DashboardFrame.defaultProps = {
	logoSrc: 'http://statics.goorm.io/logo/edu/goormedu_admin.svg',
	children: null,
	className: '',
	isResizeable: true,
};

DashboardFrame.NavBar = NavBar;
DashboardFrame.Body = Body;
DashboardFrame.SideNav = SideNav;
DashboardFrame.Content = Content;
DashboardFrame.ContentHeader = ContentHeader;

export default DashboardFrame;
