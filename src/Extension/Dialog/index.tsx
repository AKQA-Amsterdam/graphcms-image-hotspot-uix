import React, { useState, useCallback } from "react";

import {
  useFieldExtension,
  useUiExtensionDialog,
  ToastVariantColor,
} from "@graphcms/uix-react-sdk";

import "./style.css";

import { HotspotDialogProps } from "./types";

type Coordinate = {
  x: number;
  y: number;
};

const Dialog: React.FC<{}> = () => {
  const { value, imgUrl, hotspotLimit, showToast } =
    useFieldExtension() as HotspotDialogProps;
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
        const toastOptions = {
          variantColor: ToastVariantColor.error,
          title: "You have reached the number of Hotspots for this image",
        };
        showToast(toastOptions);
      }
    },

    [localValue, hotspotLimit, showToast]
  );

  const handleDotClick = useCallback(
    (idx) => {
      setLocalValue(localValue.filter((_: Coordinate, i: number) => i !== idx));
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
          {localValue.map((c: Coordinate, idx: number) => (
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
