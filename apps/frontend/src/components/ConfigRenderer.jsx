import { Button } from "@mui/material";
import { trackEvent } from "../utils/analytics";

const componentMap = {
  heading: (item, key) => <h1 key={key}>{item.text}</h1>,
  paragraph: (item, key) => <p key={key}>{item.text}</p>,
  button: (item, key) => (
    <Button
      key={key}
      variant="contained"
      onClick={() =>
        trackEvent("button_click", {
          label: item.label,
        })
      }
    >
      {item.label}
    </Button>
  ),
};

function ConfigRenderer({ config }) {
  return (
    <div className="space-y-4">
      {config.map((item, index) => {
        const Component = componentMap[item.type];
        return Component ? Component(item, index) : null;
      })}
    </div>
  );
}

export default ConfigRenderer;
