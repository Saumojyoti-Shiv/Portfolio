export interface ComingSoonProps {
  sectionName?: string;
  onBack: () => void;
}

export default function ComingSoon({ sectionName, onBack }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-[var(--accent)] w-full px-6">
      {sectionName && (
        <span className="text-xs uppercase tracking-[0.32em] text-gray-400 mb-4">
          {sectionName} Section
        </span>
      )}
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-widest mb-6 text-center">
        Coming Soon
      </h1>
      <p className="text-gray-400 text-sm md:text-base max-w-md text-center mb-8 font-light">
        This modular section is structured and ready for your upcoming portfolio expansion.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer px-8 py-3 rounded-full border border-[var(--accent)] text-black bg-[var(--accent)] font-bold text-sm md:text-base hover:bg-black hover:text-[var(--accent)] transition-colors whitespace-nowrap shrink-0"
      >
        Back to Landing Page
      </button>
    </div>
  );
}
