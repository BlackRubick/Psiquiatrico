const PillIcon = ({ size = 64, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sombra */}
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Lado izquierdo rojo - semi-círculo */}
      <path
        d="M 30 10 Q 10 10 10 30 Q 10 50 30 50 L 30 10"
        fill="#FF6B6B"
        filter="url(#shadow)"
      />

      {/* Lado derecho amarillo - semi-círculo */}
      <path
        d="M 30 10 Q 50 10 50 30 Q 50 50 30 50 L 30 10"
        fill="#FFD966"
        filter="url(#shadow)"
      />

      {/* Borde rojo para el lado izquierdo */}
      <path
        d="M 30 10 Q 10 10 10 30 Q 10 50 30 50"
        stroke="#D64545"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Borde amarillo para el lado derecho */}
      <path
        d="M 30 10 Q 50 10 50 30 Q 50 50 30 50"
        stroke="#E6B800"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Línea divisoria con degradado */}
      <line x1="30" y1="10" x2="30" y2="50" stroke="#2C3E50" strokeWidth="1.5" />

      {/* Brillo/highlight para dar efecto 3D */}
      <ellipse cx="15" cy="20" rx="4" ry="6" fill="white" opacity="0.4" />
      <ellipse cx="45" cy="20" rx="4" ry="6" fill="white" opacity="0.3" />
    </svg>
  );
};

export default PillIcon;
