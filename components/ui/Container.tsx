import { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";

type ContainerProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Container<T extends ElementType = "div">({
  as,
  children,
  className = "",
  ...props
}: ContainerProps<T>) {
  const Tag = as || "div";
  return (
    <Tag
      className={`mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
