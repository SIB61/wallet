import { useState } from "react";

import { cn } from "@/lib/utils";

// Google returns this "ACg..." prefix for accounts with no custom profile photo.
const GOOGLE_DEFAULT_AVATAR_RE =
	/https:\/\/lh3\.googleusercontent\.com\/a\/ACg[^=/]*/i;

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<circle cx="12" cy="8" r="4" />
			<path d="M4 21c0-3.5 3.6-5.5 8-5.5s8 2 8 5.5" />
		</svg>
	);
}

type UserAvatarProps = {
	src?: string | null;
	name?: string | null;
	className?: string;
};

export function UserAvatar({ src, name, className }: UserAvatarProps) {
	const [broken, setBroken] = useState(false);

	const showImage = src && !broken && !GOOGLE_DEFAULT_AVATAR_RE.test(src);

	if (showImage) {
		return (
			<img
				src={src}
				alt={name ? `${name}'s profile` : ""}
				onError={() => setBroken(true)}
				className={cn("flex-shrink-0 rounded-lg object-cover", className)}
			/>
		);
	}
	return (
		<span
			className={cn(
				"flex flex-shrink-0 items-center justify-center rounded-lg bg-[var(--lagoon-16)] text-[var(--lagoon-deep)]",
				className,
			)}
		>
			<UserIcon className="size-[60%]" />
		</span>
	);
}
