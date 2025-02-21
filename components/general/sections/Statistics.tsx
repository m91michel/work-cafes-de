import { cn } from "@/libs/utils";
import { NumberTicker } from "../magicui/NumberTicker";

type Stats = {
  quantity: string | number;
  description: string;
};

const defaultStats: Stats[] = [
  {
    quantity: "200+",
    description: "Cafes",
  },
  {
    quantity: "20+",
    description: "Städte",
  },
];

type Props = {
  stats?: Stats[];
  className?: string;
};

export const Statistics = ({ stats = defaultStats, className }: Props) => {
  return (
    <div className={cn(`grid grid-cols-2 gap-8`, className)}>
      {stats.map(({ quantity, description }) => (
        <div key={description} className="space-y-2 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold ">
            {typeof quantity === "number" ? (
              <NumberTicker value={quantity} />
            ) : (
              quantity
            )}
          </h2>
          <p className="text-xl text-muted-foreground">{description}</p>
        </div>
      ))}
    </div>
  );
};
