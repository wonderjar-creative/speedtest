import Link from "next/link";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "white";
  className?: string;
}

const variantClasses = {
  primary: "bg-primary text-white hover:bg-accent",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  white: "bg-white text-gray-900 hover:bg-gray-100",
};

export function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-block px-8 py-3 rounded-md font-semibold text-sm no-underline transition-colors ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
