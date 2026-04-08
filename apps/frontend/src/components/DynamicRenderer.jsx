import { Suspense } from "react";
import { componentRegistry } from "./registry";

const DynamicRenderer = ({ componentName, props }) => {
  const Component = componentRegistry[componentName];

  if (!Component) {
    return <div>Component "{componentName}" not found.</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

export default DynamicRenderer;
