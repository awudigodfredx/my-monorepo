import React from "react";
import HeroLeft from "../components/HeroLeft";
import HeroRight from "../components/HeroRight";

const HomePage: React.FC = () => (
  <main>
    <section className="min-h-screen flex flex-col justify-center py-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <HeroLeft />
        <HeroRight />
      </div>
    </section>
  </main>
);

export default HomePage;
