const Logo = ({ className = "w-16 h-16" }) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Base */}
        <rect x="20" y="140" width="160" height="12" fill="#4A90E2" rx="2" />
        
        {/* Columna central */}
        <rect x="93" y="80" width="14" height="60" fill="#4A90E2" />
        
        {/* Plataforma redonda */}
        <circle cx="100" cy="150" r="60" fill="#E8F4F8" stroke="#4A90E2" strokeWidth="3" />
        
        {/* Diseño de la plataforma - rayas */}
        <line x1="60" y1="150" x2="140" y2="150" stroke="#4A90E2" strokeWidth="1" opacity="0.3" />
        <line x1="63" y1="135" x2="137" y2="135" stroke="#4A90E2" strokeWidth="1" opacity="0.3" />
        <line x1="63" y1="165" x2="137" y2="165" stroke="#4A90E2" strokeWidth="1" opacity="0.3" />
        
        {/* Pantalla/Display */}
        <rect x="60" y="30" width="80" height="35" fill="#F5F5F5" stroke="#4A90E2" strokeWidth="2" rx="3" />
        
        {/* Texto de la pantalla */}
        <text x="100" y="58" font-size="24" font-weight="bold" fill="#4A90E2" text-anchor="middle" font-family="Arial">
          00
        </text>
        
        {/* Botón de encendido */}
        <circle cx="155" cy="47" r="6" fill="#FFD966" stroke="#4A90E2" strokeWidth="1.5" />
        
        {/* Decoración - línea de energía */}
        <path d="M 160 42 Q 170 35 175 45" stroke="#FFD966" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default Logo;
