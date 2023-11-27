import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  useSettings,
  Link
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {

  const { banner_title, banner_text, link_text, link } = useSettings();

  return (
    <Banner title={banner_title}>
      {banner_text}
      <Link to={link}>{link_text}</Link>
    </Banner>
  );
}