import SideNav from '@/app/ui/dashboard/sidenav';
 
export default function Layout({ 
    // the layout component receives a children prop which is this
    // this child can either be a layout or pages inside the /dashboard
    children 
}: { 
    children: React.ReactNode 
}) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}