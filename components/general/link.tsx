import { cn } from "@/libs/utils";
import Link, { LinkProps } from "next/link";

type Props = LinkProps & {
    children: React.ReactNode;
    className?: string;
};

export function MLink({ children, href, className, ...props }: Props) {
  const isExternal = href.toString().startsWith("http");
  const externalProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer nofollow" }
    : {};

  return (
    <Link href={href} className={cn(className)} {...externalProps} {...props}>
      {children}
    </Link>
  );
}
