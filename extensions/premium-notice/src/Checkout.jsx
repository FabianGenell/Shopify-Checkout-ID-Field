import {
  Banner,
  reactExtension,
  useSettings,
  Button,
  InlineLayout,
  useCustomer
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const customer = useCustomer();

  if (customer) return

  const {
    banner_title,
    banner_text = 'Recuerda hacerte del Club para conseguir los precios Premium',
    link_text = 'Hazte premium',
    link = 'https://textura-interiors-b2c.myshopify.com/pages/registro-premium'
  } = useSettings();

  return (
    <Banner title={banner_title}>
      <InlineLayout spacing='base'>
        {banner_text}
        <Button to={link}>{link_text}</Button>
      </InlineLayout>
    </Banner>
  );
}