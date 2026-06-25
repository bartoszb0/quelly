export default function Logo() {
  return (
    <div>
      <pre className="font-mono text-sm leading-none tracking-tight text-center whitespace-pre text-primary">
        {`                   __ __       
 .-----.--.--.-----|  |  .--.--.
 |  _  |  |  |  -__|  |  |  |  |
 |__   |_____|_____|__|__|___  |
     |__|                 |_____| `}
      </pre>

      <span className="text-xs font-mono text-muted-foreground mt-1">
        admin's panel
      </span>
    </div>
  );
}
