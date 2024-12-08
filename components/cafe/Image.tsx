import { ImageProps } from "next/image";
import Image from "next/image";

export const defaultCafeImage =
  "https://arbeits-cafe.b-cdn.net/default-cafe-image.jpeg";

type DefaultCafeImageProps = Omit<ImageProps, "src" | "alt">;
export function DefaultCafeImage(props: DefaultCafeImageProps) {
  return (
    <Image
      src={defaultCafeImage}
      alt="Cafe"
      fill
      className="object-cover"
      unoptimized
      priority
      {...props}
    />
  );
}
