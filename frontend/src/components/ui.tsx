import type { PropsWithChildren, ReactNode, ButtonHTMLAttributes } from "react";

export function Card(props: PropsWithChildren<{ title?: ReactNode; className?: string }>) {
    return (
        <div
            className={`rounded-3xl border border-white/15 bg-white/8 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl ${props.className ?? ""}`}
        >
            {props.title ? (
                <div className="mb-3 text-sm font-semibold tracking-wide text-white/75">
                    {props.title}
                </div>
            ) : null}
            {props.children}
        </div>
    );
}

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
};

export function Button({
                           variant = "primary",
                           className,
                           disabled,
                           ...rest
                       }: PropsWithChildren<ButtonProps>) {
    const base =
        "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium tracking-wide transition-all duration-200 focus:outline-none";

    const variants: Record<ButtonVariant, string> = {
        primary:
            "bg-white text-black hover:bg-white/90 shadow-[0_6px_30px_rgba(255,255,255,0.18)]",
        secondary:
            "border border-white/15 bg-white/8 text-white hover:bg-white/12 backdrop-blur-xl",
        ghost:
            "bg-transparent text-white/80 hover:bg-white/8 hover:text-white",
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