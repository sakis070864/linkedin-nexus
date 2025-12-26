
import React from 'react';

interface MapsViewProps {
  address: string;
}

const MapsView: React.FC<MapsViewProps> = ({ address }) => {
  const encodedAddress = encodeURIComponent(address);
  
  return (
    <div className="relative w-full h-[350px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
      {/* Decorative Overlay */}
      <div className="absolute inset-0 pointer-events-none border-[6px] border-white/20 rounded-xl z-10"></div>
      
      <iframe
        title="Property Location"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={`https://maps.google.com/maps?q=${encodedAddress}&t=m&z=15&ie=UTF8&iwloc=&output=embed`}
        className="grayscale-[0.3] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
      />
      
      {/* Visual coordinates tag */}
      <div className="absolute bottom-3 left-3 z-20 px-3 py-1.5 bg-white/90 backdrop-blur rounded-lg shadow-sm border border-slate-200 text-[10px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        Geospatial Context Active
      </div>
    </div>
  );
};

export default MapsView;
