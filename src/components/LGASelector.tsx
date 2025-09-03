import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface LGASelectorProps {
  selectedLGA: string;
  onLGAChange: (lga: string) => void;
}

const lagosLGAs = [
  { name: 'Lagos Island', description: 'Victoria Island, Ikoyi, Lagos Island' },
  { name: 'Eti-Osa', description: 'Lekki, Ajah, VGC' },
  { name: 'Ikeja', description: 'Ikeja GRA, Allen, Computer Village' },
  { name: 'Surulere', description: 'National Theatre, Alaba, Ojuelegba' },
  { name: 'Lagos Mainland', description: 'Ebute Metta, Oyingbo, Iddo' },
  { name: 'Yaba', description: 'Yaba Tech, Herbert Macaulay' },
  { name: 'Apapa', description: 'Apapa Port, Kirikiri' },
  { name: 'Kosofe', description: 'Ketu, Mile 12, Anthony' },
  { name: 'Shomolu', description: 'Palmgrove, Onipanu' },
  { name: 'Mushin', description: 'Idi-Oro, Papa Ajao' }
];

export const LGASelector = ({ selectedLGA, onLGAChange }: LGASelectorProps) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Select Local Government Area</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {lagosLGAs.map((lga) => (
          <Button
            key={lga.name}
            variant={selectedLGA === lga.name ? "default" : "outline"}
            className="h-auto p-4 text-left flex flex-col items-start justify-start hover:scale-105 transition-all duration-200"
            onClick={() => onLGAChange(lga.name)}
          >
            <span className="font-semibold text-sm">{lga.name}</span>
            <span className="text-xs text-muted-foreground mt-1 font-normal">
              {lga.description}
            </span>
          </Button>
        ))}
      </div>
      
      {selectedLGA && (
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm text-foreground">
            <span className="font-medium">Selected:</span> {selectedLGA}
          </p>
        </div>
      )}
    </div>
  );
};