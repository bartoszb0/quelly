import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PastShiftsCard({ shopId }: { shopId: string }) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-secondary/30 hover:border-accent-foreground"
      onClick={() => navigate(`/dashboard/shop/${shopId}/shifts`)}
    >
      <CardHeader className="flex items-center gap-2">
        <History className="size-5 text-muted-foreground" />
        <CardTitle className="text-base">Past shifts</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Review previous service sessions.
      </CardContent>
    </Card>
  );
}
