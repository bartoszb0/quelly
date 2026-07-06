import { Button } from "@/components/ui/button";
import type { ActiveShift } from "@/types/Shift";

export default function ShopOpen({ shift }: { shift: ActiveShift }) {
  const handleShiftChange = () => {
    console.log("change");
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1>todo</h1>
      <Button onClick={handleShiftChange}>End shift</Button>
      <p>{shift.id}</p>
    </div>
  );
}
