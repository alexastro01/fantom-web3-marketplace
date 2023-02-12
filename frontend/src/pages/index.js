import Head from 'next/head'
import Image from 'next/image'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import RecentlyCreated from '@/components/RecentlyCreated'
import RecentlySold from '@/components/RecentlySold'

export default function Home() {
  return (
    <>
      <Head>
        <title>Fantom marketplace</title>
        <meta name="description" content="Fantom marketplace" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Header />
      <RecentlyCreated />
      <RecentlySold />
    </>
  )
}
