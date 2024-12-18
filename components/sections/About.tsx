// import pilot from "../assets/pilot.png";
import { Gradient } from "../general/gradient";
import { Statistics } from "./Statistics";

const aboutStats = [
  {
    quantity: "200+",
    description: "Cafes",
  },
  {
    quantity: "20+",
    description: "Städte",
  },
];

export const About = () => {
  return (
    <section id="about" className="max-w-7xl mx-auto py-24 sm:py-32 px-4">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-12 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          {/* Images goes here */}
          <div className="w-1/3">
            <Statistics stats={aboutStats} />
          </div>

          <div className="bg-green-0 flex flex-col justify-between w-2/3">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <Gradient>Über</Gradient>{" "}Café zum Arbeiten
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Wir möchten, dass du weniger Zeit mit der Suche und mehr Zeit
                mit produktivem Arbeiten verbringst. Egal, ob du Freelancer,
                Student oder einfach auf der Suche nach einem inspirierenden
                Arbeitsort bist – wir sind hier, um dir zu helfen.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
