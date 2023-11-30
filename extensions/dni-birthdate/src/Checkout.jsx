import {
  TextField,
  reactExtension,
  useShippingAddress,
  useExtensionCapability,
  useBuyerJourneyIntercept,
  useApplyShippingAddressChange,
  useApi,
  useSettings,
  Checkbox,
  BlockLayout
} from '@shopify/ui-extensions-react/checkout';
import { useEffect, useState } from 'react';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {

  const {
    error_message = "DNI /  CIF necesarrio",
    field_name_obligatory = "DNI / CIF (obligatorio)",
    field_name_optional = "DNI / CIF (opcional)",
    is_company_text = "Soy empresa"
  } = useSettings();

  const address = useShippingAddress();
  const { cost } = useApi();

  const [isCompany, setIsCompany] = useState(address.company !== (null || undefined));
  const required = isCompany ? true : cost?.subtotalAmount?.current.amount >= 3000;
  const label = required ? field_name_obligatory : field_name_optional

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
      setValidationError(error_message);
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
              setValidationError(error_message);
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
        value={id}
        onChange={setId}
        onInput={clearValidationErrors}
        required={true}
        error={validationError}
        label={label}>
      </TextField>
      <Checkbox id="checkbox" value={isCompany} onChange={setIsCompany} name="checkbox">
        {is_company_text}
      </Checkbox>
    </BlockLayout>
  </>
  );

}