interface RightArrowIconProps {
	height?: number;
	width?: number;
	className?: string;
	fill: string;
}

export const RightArrowIcon = (props: RightArrowIconProps) => {
	return (
		<svg
			height={props?.height}
			width={props?.width}
			className={props?.className}
			viewBox="0 0 19 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M17.8004 7.45L10.6848 0.231303C10.3754 -0.0780774 9.89419 -0.0780774 9.58479 0.231303C9.27539 0.540673 9.27539 1.02192 9.58479 1.3313L15.3598 7.2094H0.750391C0.337891 7.2094 -0.00585938 7.5532 -0.00585938 7.9657C-0.00585938 8.3782 0.337891 8.7563 0.750391 8.7563H15.4285L9.58479 14.7032C9.27539 15.0126 9.27539 15.4938 9.58479 15.8032C9.72229 15.9407 9.92849 16.0094 10.1348 16.0094C10.341 16.0094 10.5473 15.9407 10.6848 15.7688L17.8004 8.55C18.1098 8.2407 18.1098 7.7594 17.8004 7.45Z"
				fill={props.fill}
			/>
		</svg>
	);
};
