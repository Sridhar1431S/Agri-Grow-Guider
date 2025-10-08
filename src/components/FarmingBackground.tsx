export function FarmingBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      {/* Animated field rows pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            hsl(var(--primary)) 0px,
            transparent 1px,
            transparent 40px,
            hsl(var(--primary)) 41px
          )`,
          animation: 'field-drift 60s linear infinite'
        }} />
      </div>

      {/* Floating particles (seeds/pollen) */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${15 + Math.random() * 20}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes field-drift {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(40px);
          }
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0.2;
          }
          90% {
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
}
