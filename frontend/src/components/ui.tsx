// src/components/ui.tsx
import type { PropsWithChildren, ReactNode } from "react";

export function Card(props: PropsWithChildren<{ title?: ReactNode }>) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur">
            {props.title ? (
                <div className="mb-3 text-sm font-semibold text-white/80">{props.title}</div>
            ) : null}
            {props.children}
        </div>
    );
}

export function Button(
    props: PropsWithChildren<{
        onClick?: () => void;
        type?: "button" | "submit";
        disabled?: boolean;
        variant?: "primary" | "secondary" | "ghost";
    }>
) {
    const variant = props.variant ?? "primary";

    const base =
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20";

    const variants: Record<string, string> = {
        primary: "bg-white text-black hover:bg-white/90",
        secondary: "bg-white/10 text-white hover:bg-white/15 border border-white/10",
        ghost: "bg-transparent text-white hover:bg-white/10",
    };

    const disabled =
        props.disabled ? "opacity-50 cursor-not-allowed hover:bg-inherit" : "";

    return (
        <button
            type={props.type ?? "button"}
            onClick={props.onClick}
            disabled={props.disabled}
            className={`${base} ${variants[variant]} ${disabled}`}
        >
            {props.children}
        </button>
    );
}
