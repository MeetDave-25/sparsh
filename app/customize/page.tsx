import type { Metadata } from 'next';
import CustomizePageClient from './CustomizePageClient';

export const metadata: Metadata = {
  title: 'Custom Order — Make it Yours | Sparsh Divine Art Studio',
  description:
    'Request a personalised handmade candle, resin art piece, jewellery, or gift hamper. Tell us your idea and we\'ll create it just for you.',
};

export default function CustomizePage() {
  return <CustomizePageClient />;
}
