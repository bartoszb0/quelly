import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NumberForm({ shopPublicId }: { shopPublicId: string }) {
  const navigate = useNavigate();

  const [number, setNumber] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate(`/s/${shopPublicId}/${number}`);
      }}
      className="mt-12 flex w-full flex-col items-center"
    >
      <label htmlFor="order-number" className="text-sm text-muted-foreground">
        Enter your order number
      </label>
      <Input
        id="order-number"
        type="text"
        inputMode="numeric"
        autoFocus
        value={number}
        onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
        placeholder="0"
        className="mt-6 h-28 w-48 border-transparent text-center text-7xl font-bold tracking-widest tabular-nums  focus-visible:ring-0"
      />
      <Button
        type="submit"
        className="mt-10 h-11 w-full text-base"
        disabled={!number}
      >
        Track my order
      </Button>
    </form>
  );
}
