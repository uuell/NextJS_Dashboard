import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
// import { fetchCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import CardWrapper from '@/app/ui/dashboard/cards';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton 
} from '@/app/ui/skeletons';

// import { fetchRevenue, fetchLatestInvoices, fetchCardData } from '@/app/lib/data';
export default async function Page() {
  // Example of Waterfall in Chapter 7
  // A "waterfall" refers to a sequence of network requests that depend on the completion of previous requests.
  // this can be intentional for sequential dependencies (e.g., fetching user data before friends' list). 
  // However, it may unintentionally impact performance due to sequential blocking. 
  // const revenue = await fetchRevenue();
  // const latestInvoices = await fetchLatestInvoices(); // wait for fetchRevenue() to finish

  // const {numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices} = await fetchCardData(); // wait for fetchLatestInvoices() to finish

  
  // PARALLEL DATA FETCHING
  // Promise.All([]). one disadvantage of relying only on this - what happens if one data request is slower than all the others?
  // this is not a dynamic functions, but the data is not cached when you request, so this is an dynamic rendering 
  // const data = await Promise.all([
  //   fetchRevenue(),
  //   fetchLatestInvoices(),
  //   fetchCardData()
  // ]) 
  // console.log(data);
  

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}