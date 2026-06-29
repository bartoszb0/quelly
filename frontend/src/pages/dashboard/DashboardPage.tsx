import ProfileDropdown from "@/components/common/ProfileDropdown";
import CreateShopDialog from "./components/CreateShopDialog";
import ShopList from "./components/ShopList";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Your shops</h1>
        <div className="flex gap-2">
          <CreateShopDialog />
          <ProfileDropdown />
        </div>
      </div>

      <div className="mt-8">
        <ShopList />
      </div>
    </div>
  );
}
