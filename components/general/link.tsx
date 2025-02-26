import { cn } from "@/libs/utils";
import Link, { LinkProps } from "next/link";

type Props = LinkProps & {
  children: React.ReactNode;
  className?: string;
  noFollow?: boolean;
};

export function MLink({ children, href, className, noFollow, ...props }: Props) {
  const isExternal = href.toString().startsWith("http");
  let externalProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer nofollow" }
    : {};

  if (noFollow) {
    externalProps.rel = "nofollow";
  }

  return (
    <Link href={href} className={cn(className)} {...externalProps} {...props}>
      {children}
    </Link>
  );
}
