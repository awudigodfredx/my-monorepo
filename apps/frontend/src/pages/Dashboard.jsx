import { useEffect, useState } from "react";
import DynamicRenderer from "../components/DynamicRenderer";
import Modal from "../components/Modal";

const Dashboard = () => {
  const [sections, setSections] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  useEffect(() => {
    import("../config/dashboard.json").then((data) =>
      setSections(data.default),
    );
  }, []);

  const handleSectionClick = (section) => {
    if (section.onClickType === "modal") {
      setModalContent({
        title: section.title,
        content: section.description || "",
      });
      setModalOpen(true);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((section) => (
        <DynamicRenderer
          key={section.id}
          componentName={section.componentType}
          props={{
            ...section,
            onClick: () => handleSectionClick(section),
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

export default Dashboard;
