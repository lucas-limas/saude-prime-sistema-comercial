export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 52"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CotPrime"
    >
      {/* Document icon */}
      <rect x="0.75" y="0.75" width="33" height="50.5" rx="6.5" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.72)" strokeWidth="1.2" />
      <rect x="4" y="7.5" width="26" height="11.5" rx="2.5" fill="rgba(255,255,255,.92)" />
      <polyline points="6.5,17.5 10.5,14 15.5,16 20,12.5 24.5,14.5 28.5,11.5" stroke="rgba(20,30,45,.7)" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="23" width="9" height="4.5" rx="1.3" fill="rgba(255,255,255,.3)" />
      <rect x="15" y="23" width="6.5" height="4.5" rx="1.3" fill="rgba(255,255,255,.3)" />
      <rect x="23.5" y="23" width="9" height="4.5" rx="1.3" fill="rgba(255,255,255,.52)" />
      <rect x="4" y="29.5" width="9" height="4.5" rx="1.3" fill="rgba(255,255,255,.3)" />
      <rect x="15" y="29.5" width="6.5" height="4.5" rx="1.3" fill="rgba(255,255,255,.3)" />
      <rect x="23.5" y="29.5" width="9" height="4.5" rx="1.3" fill="rgba(255,255,255,.52)" />
      <rect x="4" y="36" width="9" height="4.5" rx="1.3" fill="rgba(255,255,255,.3)" />
      <rect x="15" y="36" width="6.5" height="4.5" rx="1.3" fill="rgba(255,255,255,.3)" />
      <rect x="23.5" y="36" width="9" height="4.5" rx="1.3" fill="rgba(255,255,255,.52)" />
      <rect x="4" y="42.5" width="15.5" height="4.5" rx="1.3" fill="rgba(255,255,255,.23)" />
      <rect x="23.5" y="42.5" width="9" height="4.5" rx="1.3" fill="rgba(255,255,255,.88)" />
      {/* Wordmark */}
      <text x="43" y="22" fontFamily="Outfit,system-ui,sans-serif" fontSize="10" fontWeight="200" letterSpacing="5" fill="rgba(255,255,255,.5)">COT</text>
      <line x1="43" y1="27.5" x2="122" y2="27.5" stroke="rgba(255,255,255,.17)" strokeWidth="0.6" />
      <text x="43" y="46" fontFamily="Outfit,system-ui,sans-serif" fontSize="21" fontWeight="700" letterSpacing="0.5" fill="rgba(255,255,255,.96)">PRIME</text>
    </svg>
  );
}
