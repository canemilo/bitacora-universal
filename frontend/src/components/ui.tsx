// src/components/ui.tsx
import type { PropsWithChildren, ReactNode, ButtonHTMLAttributes } from "react";

export function Card(props: PropsWithChildren<{ title?: ReactNode; className?: string }>) {
    return (
        <div className={`rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur ${props.className ?? ""}`}>
            {props.title ? (
                <div className="mb-3 text-sm font-semibold text-white/80">{props.title}</div>
            ) : null}
            {props.children}
        </div>
    );
}

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
};

export function Button({ variant = "primary", className, disabled, ...rest }: PropsWithChildren<ButtonProps>) {
    const base =
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20";

    const variants: Record<ButtonVariant, string> = {
        primary: "bg-white text-black hover:bg-white/90",
        secondary: "bg-white/10 text-white hover:bg-white/15 border border-white/10",
        ghost: "bg-transparent text-white hover:bg-white/10",
    };

    const disabledCls = disabled ? "opacity-50 cursor-not-allowed" : "";

    return (
        <button
            {...rest}
            disabled={disabled}
            className={`${base} ${variants[variant]} ${disabledCls} ${className ?? ""}`}
        >
            {rest.children}
        </button>
    );
}