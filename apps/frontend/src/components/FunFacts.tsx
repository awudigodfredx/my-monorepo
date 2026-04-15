import React from "react";

interface FunFactsProps {
  facts: string[];
}

const FunFacts: React.FC<FunFactsProps> = ({ facts }) => (
  <div className="mt-6 flex flex-wrap gap-3" data-testid="fun-facts">
    {facts.map((fact, index) => (
      <span
        key={`${fact}-${index}`}
        className="border border-brand-primary bg-white px-4 py-2 font-mono text-xs uppercase tracking-wide text-brand-primary"
        data-testid={`fact-${index}`}
      >
        {fact}
      </span>
    ))}
  </div>
);

export default FunFacts;
