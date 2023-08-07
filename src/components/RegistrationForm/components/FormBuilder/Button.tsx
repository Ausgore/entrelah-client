import { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<motion.button
			initial={{ backgroundColor: "#ef4444" }}
			whileHover={{ backgroundColor: "#d62525" }}
			whileTap={{ scale: 0.98 }}
			transition={{ ease: "easeOut", duration: 0.2 }}
			className={`text-white font-semibold py-2 rounded w-80 ${props.className}`} onClick={props.onClick}
		>
			{props.children}
		</motion.button>
	);
}