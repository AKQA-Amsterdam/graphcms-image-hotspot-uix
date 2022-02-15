import { useState, useEffect, useCallback, useMemo } from "react";

import { useFieldExtension } from "@graphcms/uix-react-sdk";

import "./style.css";

const Field = () => {
  const { form, value, onChange, openDialog, extension, showToast } =
    useFieldExtension();
  const [image, setImage] = useState("");
  const jsonValue = useMemo(() => JSON.stringify(value, null, 2), [value]);

  const handleImageUpdate = useCallback(
    (data) => {
      // Comparing values with image to ensure we don't make excesive calls in subscription
      if (data.value && data.value.url !== image) {
        setImage(data.value.url);
      } else if (!data.value && image.length) {
        setImage("");
        onChange([]);
      }
    },
    [onChange, image]
  );

  const subscribeToImageChanges = useCallback(async () => {
    const { IMAGE_FIELD_ID } = extension.fieldConfig;
    form.subscribeToFieldState(IMAGE_FIELD_ID, handleImageUpdate);
  }, [form, extension, handleImageUpdate]);

  const handleOpenDialog = useCallback(async () => {
    try {
      const { HOTSPOT_LIMIT } = extension.fieldConfig;
      const v = await openDialog("/selector", {
        disableOverlayClick: true,
        maxWidth: "80vw",
        imgUrl: image,
        value,
        hotspotLimit: HOTSPOT_LIMIT,
      });
      onChange(v);
    } catch {
      showToast({ title: "Error saving hotspots to field" });
    }
  }, [openDialog, image, value, extension, showToast, onChange]);

  useEffect(() => {
    subscribeToImageChanges();
  }, [subscribeToImageChanges]);

  return image.length ? (
    <>
      <button onClick={handleOpenDialog}>Edit Hotspots</button>
      <div>
        <label htmlFor="preview">Coordinates</label>
        <textarea
          id="preview"
          name="preview"
          readOnly
          value={jsonValue}
        ></textarea>
      </div>
    </>
  ) : (
    <>You need to upload an image before setting Hotspots</>
  );
};

export default Field;
