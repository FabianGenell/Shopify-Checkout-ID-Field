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

  return (
    <Banner title={banner_title}>
      {banner_text}
    </Banner>
  );
}