export function PlanCard({ title, price, vat, perks, current }: {
  title: string; 
  price: number; 
  vat: number; 
  perks: string[]; 
  current?: boolean;
}) {
  const total = Math.round(price * (1 + vat));
  
  return (
    <div className="p-4 tz-gem-border">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-xl font-bold">TSh {price.toLocaleString()}</div>
      </div>
      <ul className="mt-3 space-y-1 text-sm tz-text-dim">
        {perks.map(p => <li key={p}>✓ {p}</li>)}
      </ul>
      <div className="mt-4 text-sm tz-text-dim">
        VAT {Math.round(vat * 100)}% included → <span className="text-white">TSh {total.toLocaleString()}</span>/month
      </div>

      <div className="mt-4">
        {current ? (
          <div className="text-xs tz-text-dim">Current plan</div>
        ) : (
          <button className="w-full rounded-xl py-2 font-semibold tz-gem-border tz-shimmer">
            Upgrade
          </button>
        )}
      </div>
    </div>
  );
}
