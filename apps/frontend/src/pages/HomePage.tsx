import { useState } from "react";
import Card from "../components/Card";
import Modal from "../components/Modal";

const HomePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  const handleCardClick = (title: string, description: string) => {
    setModalContent({ title, content: description });
    setModalOpen(true);
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        title="Project 1"
        description="Description for project 1"
        onClick={() =>
          handleCardClick("Project 1", "Description for project 1")
        }
      />
      <Card
        title="Project 2"
        description="Description for project 2"
        onClick={() =>
          handleCardClick("Project 2", "Description for project 2")
        }
      />
      <Card
        title="Project 3"
        description="Description for project 3"
        onClick={() =>
          handleCardClick("Project 3", "Description for project 3")
        }
      />
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
