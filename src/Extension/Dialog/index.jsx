import { useState, useCallback } from "react";

import {
  useFieldExtension,
  useUiExtensionDialog,
} from "@graphcms/uix-react-sdk";

import "./style.css";

const Dialog = () => {
  const { value, imgUrl, hotspotLimit, showToast } = useFieldExtension();
  const { onCloseDialog } = useUiExtensionDialog();
  const [localValue, setLocalValue] = useState(value || []);

  const handleCancel = useCallback(() => {
    onCloseDialog(value);
  }, [value, onCloseDialog]);

  const handleSave = useCallback(() => {
    onCloseDialog(localValue);
  }, [localValue, onCloseDialog]);

  const handleImageClick = useCallback(
    (e) => {
      if (localValue.length < hotspotLimit) {
        const imgRect = e.target.getBoundingClientRect();
        setLocalValue([
          ...localValue,
          {
            x: e.clientX - imgRect.left,
            y: e.clientY - imgRect.top,
          },
        ]);
      } else {
        showToast({
          title: "You have reached the number of Hotspots for this image",
        });
      }
    },

    [localValue, hotspotLimit, showToast]
  );

  const handleDotClick = useCallback(
    (idx) => {
      setLocalValue(localValue.filter((_, i) => i !== idx));
    },
    [localValue]
  );

  return (
    <div className="dialog-wrapper">
      <div className="toolbar">
        <button onClick={handleCancel}>Cancel</button>
        <button onClick={handleSave}>Save</button>
      </div>
      <div className="image-container">
        <div className="image-wrapper">
          <img src={imgUrl} alt="Add Hotspots" onClick={handleImageClick} />
          {localValue.map((c, idx) => (
            <button
              key={`${c.x}-${c.y}-${idx}`}
              className="dot"
              style={{ top: `${c.y}px`, left: `${c.x}px` }}
              onClick={() => handleDotClick(idx)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
