import React, { useState, useEffect } from "react";
import DynamicRenderer from "../components/DynamicRenderer";
import Modal from "../components/Modal";

interface CardConfig {
  id: number;
  title: string;
  description: string;
}

const HomePage: React.FC = () => {
  const [cards, setCards] = useState<CardConfig[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  useEffect(() => {
    // Load cards dynamically from JSON
    import("../config/cards.json").then((data) => setCards(data.default));
  }, []);

  const handleCardClick = (title: string, description: string) => {
    setModalContent({ title, content: description });
    setModalOpen(true);
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <DynamicRenderer
          key={card.id}
          componentName="Card"
          props={{
            title: card.title,
            description: card.description,
            onClick: () => handleCardClick(card.title, card.description),
          }}
        />
      ))}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
        content={modalContent.content}
      />
    </div>
  );
};

export default HomePage;
