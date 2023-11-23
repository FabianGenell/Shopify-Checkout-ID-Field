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
  useApplyMetafieldsChange,
  useApplyNoteChange,
  useCustomer
} from '@shopify/ui-extensions-react/checkout';
import { useEffect, useState } from 'react';

export default reactExtension(
  'purchase.checkout.delivery-address.render-after',
  () => <Extension />,
);

function Extension() {
  const address = useShippingAddress();
  const customer = useCustomer();
  // Merchants can toggle the `block_progress` capability behavior within the checkout editor
  const [id, setId] = useState(address.company || "");

  const canBlockProgress = useExtensionCapability("block_progress");
  const [validationError, setValidationError] = useState("");
  const [hasRendered, setHasRendered] = useState(false);

  const [validDate, setValidDate] = useState("");




  const dateMetafield = useMetafield({
    namespace: "shipping",
    key: "birth_date",
  });
  // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();

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
      setValidationError("Enter your ID Number");
    }



    setHasRendered(true)
  }, [id]);

  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    if (canBlockProgress) {
      if (id.length < 5) {
        return {
          behavior: "block",
          reason: "ID is required",
          perform: (result) => {
            // If progress can be blocked, then set a validation error on the custom field
            if (result.behavior === "block") {
              setValidationError("Enter your ID Number");
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
  if (!customer) {
    return (<>
      <BlockLayout spacing='base'>
        <TextField
          value={id}
          onChange={setId}
          onInput={clearValidationErrors}
          required={true}
          error={validationError}
          label='NIF / CIF'>
        </TextField>
        <DateField
          value={dateMetafield?.value}
          label="Fecha de nacimiento (YYYY-MM-DD)"
          onInvalid={() => setValidDate(false)}
          error={validDate && 'Revisa la fecha'}
          onChange={(value) => {
            applyMetafieldsChange({
              type: "updateMetafield",
              namespace: "shipping",
              key: "birth_date",
              valueType: "string",
              value,
            });
          }}
        />
      </BlockLayout>
    </>
    );

  }
  return;
}