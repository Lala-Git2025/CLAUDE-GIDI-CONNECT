import { useState, useEffect } from 'react';

interface TrafficData {
  id: string;
  location: string;
  severity: 'light' | 'moderate' | 'heavy' | 'critical';
  description: string;
  area: string;
}

const LAGOS_HOTSPOTS = [
  { location: 'Third Mainland Bridge', direction: 'Inward Island', area: 'Island' },
  { location: 'Eko Bridge', direction: 'Both Directions', area: 'Island' },
  { location: 'Carter Bridge', direction: 'Outward Mainland', area: 'Mainland' },
  { location: 'Ikorodu Road', direction: 'Ketu to Ojota', area: 'Mainland' },
  { location: 'Lekki-Epe Expressway', direction: 'Lekki to Ajah', area: 'Lekki' },
  { location: 'Apapa-Oshodi Expressway', direction: 'Both Directions', area: 'Mainland' },
  { location: 'Lagos-Ibadan Expressway', direction: 'Berger to Kara', area: 'Mainland' },
  { location: 'Ozumba Mbadiwe', direction: 'VI to Lekki', area: 'Island' },
  { location: 'Iyana-Ipaja', direction: 'Inward Ikeja', area: 'Mainland' },
  { location: 'Admiralty Way', direction: 'Both Directions', area: 'Lekki' },
  { location: 'Allen Avenue', direction: 'Ikeja', area: 'Mainland' },
  { location: 'Falomo Bridge', direction: 'Ikoyi to VI', area: 'Island' },
];

const generateTrafficAlerts = (): TrafficData[] => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  const severityTexts = {
    light: 'Light traffic flow',
    moderate: 'Moderate traffic',
    heavy: 'Heavy gridlock',
    critical: 'Critical congestion'
  };

  const getSeverityForTime = () => {
    // Weekdays (Monday-Friday)
    if (day >= 1 && day <= 5) {
      // Morning rush (6am-10am) or Evening rush (4pm-8pm)
      if ((hour >= 6 && hour <= 10) || (hour >= 16 && hour <= 20)) {
        return Math.random() > 0.5 ? 'heavy' : 'critical';
      }
      // Midday (11am-3pm)
      else if (hour >= 11 && hour <= 15) {
        return Math.random() > 0.5 ? 'moderate' : 'heavy';
      }
      // Off-peak hours
      else {
        return Math.random() > 0.7 ? 'moderate' : 'light';
      }
    }
    // Weekends
    else {
      if (hour >= 14 && hour <= 20) {
        return Math.random() > 0.6 ? 'moderate' : 'light';
      } else {
        return 'light';
      }
    }
  };

  // Generate traffic for 4-6 random hotspots
  const numberOfAlerts = Math.floor(Math.random() * 3) + 4; // 4-6 alerts
  const shuffled = [...LAGOS_HOTSPOTS].sort(() => Math.random() - 0.5);
  const selectedHotspots = shuffled.slice(0, numberOfAlerts);

  return selectedHotspots.map((hotspot, index) => {
    const severity = getSeverityForTime() as 'light' | 'moderate' | 'heavy' | 'critical';

    return {
      id: `traffic-${Date.now()}-${index}`,
      location: hotspot.location,
      area: hotspot.area,
      severity,
      description: `${severityTexts[severity]} - ${hotspot.direction}`
    };
  });
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return '#dc2626';
    case 'heavy': return '#ef4444';
    case 'moderate': return '#eab308';
    case 'light': return '#22c55e';
    default: return '#eab308';
  }
};

const getSeverityEmoji = (severity: string) => {
  switch (severity) {
    case 'critical': return '🚨';
    case 'heavy': return '⚠️';
    case 'moderate': return '⚡';
    case 'light': return '✅';
    default: return '⚠️';
  }
};

export const TrafficAlert = () => {
  const [trafficAlerts, setTrafficAlerts] = useState<TrafficData[]>([]);

  useEffect(() => {
    setTrafficAlerts(generateTrafficAlerts());

    // Update traffic every 5 minutes
    const interval = setInterval(() => {
      setTrafficAlerts(generateTrafficAlerts());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (trafficAlerts.length === 0) return null;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center px-4 mb-3">
        <h2 className="text-base font-bold text-white">🚦 Live Traffic Updates</h2>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[11px] text-gray-500 font-semibold">Live</span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 scrollbar-hide">
        {trafficAlerts.map((traffic) => (
          <div
            key={traffic.id}
            className="min-w-[200px] bg-zinc-900 rounded-2xl border border-zinc-800 p-3"
          >
            <div className="flex justify-between items-center mb-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: getSeverityColor(traffic.severity) }}
              >
                <span className="text-base">{getSeverityEmoji(traffic.severity)}</span>
              </div>
              <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/15 px-2 py-1 rounded-md">
                {traffic.area}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-bold text-white truncate">
                {traffic.location}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-2 leading-4">
                {traffic.description}
              </p>
              <div
                className="self-start px-2 py-1 rounded-md mt-1"
                style={{ backgroundColor: `${getSeverityColor(traffic.severity)}20` }}
              >
                <span
                  className="text-[9px] font-bold tracking-wide"
                  style={{ color: getSeverityColor(traffic.severity) }}
                >
                  {traffic.severity.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
