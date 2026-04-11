const PillIcon = ({ size = 48, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Lado izquierdo rojo */}
      <ellipse cx="14" cy="24" rx="10" ry="14" fill="#FF6B6B" stroke="#2C3E50" strokeWidth="2" />
      
      {/* Lado derecho amarillo */}
      <ellipse cx="34" cy="24" rx="10" ry="14" fill="#FFD966" stroke="#2C3E50" strokeWidth="2" />
      
      {/* Línea divisoria */}
      <line x1="24" y1="10" x2="24" y2="38" stroke="#2C3E50" strokeWidth="2" />
    </svg>
  );
};

export default PillIcon;
