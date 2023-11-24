import {
  Text,
  TextField,
  reactExtension,
  useShippingAddress,
  useExtensionCapability,
  useBuyerJourneyIntercept,
  useApplyShippingAddressChange,
  useApi,
} from '@shopify/ui-extensions-react/checkout';
import { useEffect, useState } from 'react';

export default reactExtension(
  'purchase.checkout.delivery-address.render-after',
  () => <Extension />,
);

function Extension() {
  const address = useShippingAddress();
  const { cost } = useApi();

  const required = cost?.subtotalAmount?.current.amount > 3000;
  const label = required ? 'NIF / CIF (obligatorio)' : 'NIF / CIF (opcional)'

  // Set up the app state
  const [id, setId] = useState(address.company || "");
  const [validationError, setValidationError] = useState("");
  const [hasRendered, setHasRendered] = useState(false);

  //work around for using hooks inside useEffect
  const applyShippingAddressChange = useApplyShippingAddressChange();

  useEffect(() => {
    applyShippingAddressChange({
      type: 'updateShippingAddress',
      address: {
        company: id
      }
    });

    if (hasRendered && id.length < 5) {
      setValidationError("NIF / CIF esta obligatorio para pedidos mas de €3000");
    }

    setHasRendered(true)
  }, [id])

  // Merchants can toggle the `block_progress` capability behavior within the checkout editor
  const canBlockProgress = useExtensionCapability("block_progress");

  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    if (canBlockProgress && required) {
      if (id.length < 5) {
        return {
          behavior: "block",
          reason: "Note is required",
          perform: (result) => {
            // If progress can be blocked, then set a validation error on the custom field
            if (result.behavior === "block") {
              setValidationError("NIF / CIF esta obligatorio para pedidos mas de €3000");
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
    <TextField
      value={id}
      onChange={setId}
      onInput={clearValidationErrors}
      required={true}
      error={validationError}
      label={label}>
    </TextField>
  </>
  );

}