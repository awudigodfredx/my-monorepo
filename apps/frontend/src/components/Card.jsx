const Card = ({ title, description, onClick }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700 mb-4">{description}</p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={onClick}
      >
        Learn More
      </button>
    </div>
  );
};

export default Card;
