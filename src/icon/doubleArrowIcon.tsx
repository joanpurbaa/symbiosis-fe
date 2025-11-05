interface DoubleArrowIconProps {
	className: string;
}

export const DoubleArrowIcon = (props: DoubleArrowIconProps) => {
	return (
		<svg
			className={props.className}
			viewBox="0 0 19 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M0.335938 9.21178L8.75475 17.6306L10.6726 15.7127L4.17167 9.21178L10.6726 2.71083L8.75475 0.792969L0.335938 9.21178ZM7.99926 9.21178L16.4181 17.6306L18.3359 15.7127L11.835 9.21178L18.3359 2.71083L16.4181 0.792969L7.99926 9.21178Z"
				fill="oklch(44.2% 0.017 285.786)"
			/>
		</svg>
	);
};
