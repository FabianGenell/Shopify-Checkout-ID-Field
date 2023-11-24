import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  useSettings
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {

  const { banner_title, banner_text } = useSettings();

  const { extension } = useApi();

  return (
    <Banner title={banner_title}>
      {banner_text}
    </Banner>
  );
}