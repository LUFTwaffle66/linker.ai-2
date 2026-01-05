import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ locale: string }>; // 1. Define params as a Promise
}

export default async function Page({ params }: Props) {
  // 2. Await the params before using them
  const { locale } = await params;
  
  redirect(`/${locale}/messages`);
}