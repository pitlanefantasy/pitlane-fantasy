export default function StartLights({ active = 5 }) {
  return (
    <div className="flex gap-2 justify-center mb-4">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`w-4 h-4 rounded-full ${
            i < active
              ? 'bg-pit-red shadow-[0_0_10px_2px_rgba(228,0,43,0.6)]'
              : 'bg-pit-asphalt-light border border-pit-grey/30'
          }`}
        />
      ))}
    </div>
  );
}
