import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NumberForm({ shopPublicId }: { shopPublicId: string }) {
  const navigate = useNavigate();

  const [number, setNumber] = useState("");

  const handleSubmit = (e: any) => {
    console.log(number);
    e.preventDefault();
    navigate(`/s/${shopPublicId}/${number}`);
  };

  return (
    <div className="flex flex-col mx-auto">
      <p>Input your number</p>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <Input
          type="text"
          inputMode="numeric"
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
          maxLength={2}
          className="mt-10 h-32 w-40 text-center text-8xl font-bold tracking-widest"
        />
        <Button className="mt-12" disabled={!number}>
          Track my order
        </Button>
      </form>
    </div>
  );
}
