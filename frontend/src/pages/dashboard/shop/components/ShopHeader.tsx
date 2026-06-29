import ProfileDropdown from "@/components/common/ProfileDropdown";

export default function ShopHeader({ name }: { name: string }) {
  return (
    <header className="border-b bg-secondary/50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <h1 className="truncate text-lg font-semibold tracking-tight">
          {name}
        </h1>
        <ProfileDropdown />
      </div>
    </header>
  );
}
