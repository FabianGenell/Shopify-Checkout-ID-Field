import {
  Text,
  TextField,
  reactExtension,
  useShippingAddress,
  useExtensionCapability,
  useBuyerJourneyIntercept,
  useApplyShippingAddressChange,
  useApi,
  DateField,
  Select,
  InlineLayout,
  BlockLayout,
  useMetafield,
  useApplyMetafieldsChange
} from '@shopify/ui-extensions-react/checkout';
import { useEffect, useState } from 'react';

export default reactExtension(
  'purchase.checkout.delivery-address.render-after',
  () => <Extension />,
);

function Extension() {

  // Merchants can toggle the `block_progress` capability behavior within the checkout editor
  const canBlockProgress = useExtensionCapability("block_progress");
  const [validationError, setValidationError] = useState("");
  const [hasRendered, setHasRendered] = useState(false);

  const [validDate, setValidDate] = useState("");

  // Get a reference to the metafield
  const dniMetafield = useMetafield({
    namespace: "shipping",
    key: "dni",
  });
  const dateMetafield = useMetafield({
    namespace: "shipping",
    key: "birth_date",
  });
  // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();



  useEffect(() => {
    if (hasRendered && dniMetafield.value.length < 5) {
      setValidationError("Enter your ID Number");
    }

    setHasRendered(true)
  }, [dniMetafield]);

  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    if (canBlockProgress) {
      if (dniMetafield.value.length < 5) {
        return {
          behavior: "block",
          reason: "ID is required",
          perform: (result) => {
            // If progress can be blocked, then set a validation error on the custom field
            if (result.behavior === "block") {
              setDNIValidationError("Enter your ID Number");
            }
          },
        };
      }

    }
    return {
      behavior: "allow",
      perform: () => {
        clearValidationErrors();
      },
    };
  });

  function clearValidationErrors() {
    setValidationError("");
  }

  return (<>
    <BlockLayout spacing='base'>
      <TextField
        value={dniMetafield?.value}
        onChange={(value) => {
          applyMetafieldsChange({
            type: "updateMetafield",
            namespace: "shipping",
            key: "dni",
            valueType: "string",
            value,
          });
        }} onInput={clearValidationErrors}
        required={true}
        error={validationError}
        label='DNI'>
      </TextField>
      <DateField
        label="Fecha de nacimiento"
        onInvalid={() => setValidDate(false)}
        error={validDate && 'Revisa la fecha'}
        onChange={(value) => {
          applyMetafieldsChange({
            type: "updateMetafield",
            namespace: "shipping",
            key: "birth_date",
            valueType: "date",
            value,
          });
        }}
      />
    </BlockLayout>
  </>
  );

}