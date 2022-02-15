import { useState, useEffect, useCallback, useMemo } from "react";

import { useFieldExtension, ToastVariantColor } from "@graphcms/uix-react-sdk";
import { HotspotDialogProps } from "../Dialog/types";

import "./style.css";

const Field: React.FC<{}> = () => {
  const uiExtensionProps = useFieldExtension();
  const { form, value, onChange, extension } = uiExtensionProps;
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
    form.subscribeToFieldState(IMAGE_FIELD_ID as string, handleImageUpdate, {
      value: true,
    });
  }, [form, extension, handleImageUpdate]);

  const handleOpenDialog = useCallback(async () => {
    const { extension, openDialog, showToast, onChange } = uiExtensionProps;
    try {
      const { HOTSPOT_LIMIT } = extension.fieldConfig;
      const v = await openDialog("/selector", {
        disableOverlayClick: true,
        maxWidth: "80vw",
        imgUrl: image,
        hotspotLimit: HOTSPOT_LIMIT,
        ...uiExtensionProps,
      } as HotspotDialogProps);
      onChange(v);
    } catch {
      const toastOptions = {
        variantColor: ToastVariantColor.error,
        title: "Error saving hotspots to field",
      };
      showToast(toastOptions);
    }
  }, [image, uiExtensionProps]);

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
