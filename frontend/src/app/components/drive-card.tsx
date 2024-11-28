import type { DriverOption } from '@/types/ride';

interface DriverCardProps {
  driver: DriverOption;
  isSelected: boolean;
  onSelect: (driver: DriverOption) => void;
}

export function DriverCard({ driver, isSelected, onSelect }: DriverCardProps) {
  return (
    <div
      className={`p-4 border rounded-lg transition-colors cursor-pointer hover:border-primary ${isSelected ? 'border-primary bg-muted' : ''
        }`}
      onClick={() => onSelect(driver)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium">{driver.name}</h4>
          <p className="text-sm text-muted-foreground">{driver.vehicle}</p>
        </div>
        <p className="text-lg font-semibold">R$ {driver.value.toLocaleString('pt-BR', { currency: 'BRL' })}</p>
      </div>
      <p className="text-sm mb-2">{driver.description}</p>
      <div className="text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`h-4 w-4 ${i < driver.review_rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
            >
              ★
            </span>
          ))}
          <span className="ml-2">{driver.review_rating}/5</span>
        </div>
        <p className="mt-1 italic">"{driver.review_comment}"</p>
      </div>
    </div>
  );
}

