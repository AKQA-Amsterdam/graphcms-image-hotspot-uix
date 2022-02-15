import {
  FieldExtensionType,
  FieldExtensionFeature,
} from "@graphcms/uix-react-sdk";

const declaration = {
  extensionType: "field",
  fieldType: FieldExtensionType.JSON,
  features: [FieldExtensionFeature.FieldRenderer],
  name: "Image Hotspots",
  fieldConfig: {
    IMAGE_FIELD_ID: {
      type: "string",
      displayName: "Image Field ID",
      description:
        "The ID of the field that contains the image to set the hotspots on",
      required: true,
    },
    HOTSPOT_LIMIT: {
      type: "number",
      displayName: "Max Number of Hotspots",
      description:
        "The maximum amount of hotspots that can be added to the image",
      required: true,
    },
  },
};

export default declaration;
