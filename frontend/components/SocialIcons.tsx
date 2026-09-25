import React from 'react';

export interface SocialItem {
  id: string;
  name: string;
  url: string;
  ariaLabel: string;
  icon: (props: { className?: string }) => JSX.Element;
  colorClass: string;
  badge?: string;
}

export const SOCIAL_LINKS: SocialItem[] = [
  {
    id: 'scholar',
    name: 'Google Scholar',
    ariaLabel: 'Google Scholar Profile of Dr. Prabh Deep Singh',
    url: 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Prabh+Deep+Singh',
    colorClass: 'text-[#4285F4] bg-[#4285F4]/12 border-[#4285F4]/35 hover:bg-[#4285F4]/25 hover:border-[#4285F4] hover:shadow-[0_0_14px_rgba(66,133,244,0.55)]',
    badge: 'Scholar',
    icon: ({ className = 'w-4 h-4' }) => (
      <svg viewBox="0 0 24 24" fill="#4285F4" className={className} aria-hidden="true">
        <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z" />
      </svg>
    ),
  },
  {
    id: 'researchgate',
    name: 'ResearchGate',
    ariaLabel: 'ResearchGate Profile of Dr. Prabh Deep Singh',
    url: 'https://www.researchgate.net/search.Search.html?query=Prabh+Deep+Singh',
    colorClass: 'text-[#00CCBB] bg-[#00CCBB]/12 border-[#00CCBB]/35 hover:bg-[#00CCBB]/25 hover:border-[#00CCBB] hover:shadow-[0_0_14px_rgba(0,204,187,0.55)]',
    badge: 'ResearchGate',
    icon: ({ className = 'w-4 h-4' }) => (
      <svg viewBox="0 0 24 24" fill="#00CCBB" className={className} aria-hidden="true">
        <path d="M19.586 0c-.818 0-1.508.19-2.072.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 0 0-1.128-.163c-.87 0-1.605.275-2.201.823-.597.55-.895 1.29-.895 2.22 0 .507.098.98.294 1.418-.21.14-.407.29-.59.45-.184.162-.338.32-.464.475a13.3 13.3 0 0 0-1.745 2.85 18.06 18.06 0 0 0-1.055 3.218 10.61 10.61 0 0 0-.356 2.378c0 1.258.337 2.27 1.01 3.036.673.766 1.636 1.15 2.89 1.15 1.096 0 2.01-.277 2.742-.832.732-.555 1.22-1.332 1.464-2.33h-2.923v-2.392h5.795c.046.364.07.728.07 1.092 0 1.63-.51 3.013-1.53 4.148-1.02 1.136-2.455 1.704-4.305 1.704-1.99 0-3.553-.615-4.69-1.846-1.137-1.23-1.705-2.883-1.705-4.957 0-1.63.385-3.238 1.154-4.823.77-1.586 1.847-2.99 3.23-4.212-1.066.07-1.922.37-2.568.9-.646.53-1.054 1.272-1.225 2.226h-2.73c.18-1.76.883-3.13 2.11-4.11 1.227-.98 2.895-1.47 5.004-1.47.37 0 .736.017 1.098.052A3.86 3.86 0 0 1 15.65.688C16.48.23 17.51 0 18.742 0c1.47 0 2.656.402 3.557 1.206.9.804 1.35 1.905 1.35 3.303 0 .84-.19 1.603-.57 2.29-.38.686-.92 1.22-1.62 1.602l3.418 6.799h-3.328l-2.87-5.914c-.168.01-.336.015-.504.015h-.895v5.899H14.54V2.825h3.18c.84 0 1.488.196 1.944.588.456.392.684.945.684 1.66 0 .77-.246 1.35-.738 1.742-.492.392-1.18.588-2.064.588h-.83v2.097h.83c1.372 0 2.455-.333 3.25-1 .795-.666 1.192-1.628 1.192-2.885 0-1.077-.367-1.954-1.1-2.63C21.144.31 20.485 0 19.586 0z" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    ariaLabel: 'LinkedIn Profile of Dr. Prabh Deep Singh',
    url: 'https://www.linkedin.com/in/',
    colorClass: 'text-[#0A66C2] bg-[#0A66C2]/12 border-[#0A66C2]/35 hover:bg-[#0A66C2]/25 hover:border-[#0A66C2] hover:shadow-[0_0_14px_rgba(10,102,194,0.55)]',
    badge: 'LinkedIn',
    icon: ({ className = 'w-4 h-4' }) => (
      <svg viewBox="0 0 24 24" fill="#0A66C2" className={className} aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    ariaLabel: 'Chat with Dr. Prabh Deep Singh on WhatsApp',
    url: 'https://wa.me/?text=Hello%20Dr.%20Prabh%20Deep%20Singh%2C%20reaching%20out%20from%20your%20portfolio',
    colorClass: 'text-[#25D366] bg-[#25D366]/12 border-[#25D366]/35 hover:bg-[#25D366]/25 hover:border-[#25D366] hover:shadow-[0_0_14px_rgba(37,211,102,0.55)]',
    badge: 'WhatsApp',
    icon: ({ className = 'w-4 h-4' }) => (
      <svg viewBox="0 0 24 24" fill="#25D366" className={className} aria-hidden="true">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    name: 'Instagram',
    ariaLabel: 'Follow Dr. Prabh Deep Singh on Instagram',
    url: 'https://www.instagram.com/',
    colorClass: 'text-[#E1306C] bg-[#E1306C]/12 border-[#E1306C]/35 hover:bg-[#E1306C]/25 hover:border-[#E1306C] hover:shadow-[0_0_14px_rgba(225,48,108,0.55)]',
    badge: 'Instagram',
    icon: ({ className = 'w-4 h-4' }) => (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <defs>
          <radialGradient id="ig-radial-native" cx="30%" cy="107%" r="150%">
            <stop offset="0%" stopColor="#fdf497" />
            <stop offset="10%" stopColor="#fdf497" />
            <stop offset="45%" stopColor="#fd5949" />
            <stop offset="60%" stopColor="#d6249f" />
            <stop offset="90%" stopColor="#285AEB" />
          </radialGradient>
        </defs>
        <path
          fill="url(#ig-radial-native)"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
        />
      </svg>
    ),
  },
  {
    id: 'facebook',
    name: 'Facebook',
    ariaLabel: 'Follow Dr. Prabh Deep Singh on Facebook',
    url: 'https://www.facebook.com/',
    colorClass: 'text-[#1877F2] bg-[#1877F2]/12 border-[#1877F2]/35 hover:bg-[#1877F2]/25 hover:border-[#1877F2] hover:shadow-[0_0_14px_rgba(24,119,242,0.55)]',
    badge: 'Facebook',
    icon: ({ className = 'w-4 h-4' }) => (
      <svg viewBox="0 0 24 24" fill="#1877F2" className={className} aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    ariaLabel: 'Follow Dr. Prabh Deep Singh on X',
    url: 'https://x.com/',
    colorClass: 'text-white bg-white/[0.08] border-white/25 hover:bg-white/20 hover:border-white/60 hover:shadow-[0_0_14px_rgba(255,255,255,0.4)]',
    badge: 'X',
    icon: ({ className = 'w-4 h-4' }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'youtube',
    name: 'YouTube',
    ariaLabel: 'Subscribe to Dr. Prabh Deep Singh YouTube Channel',
    url: 'https://www.youtube.com/',
    colorClass: 'text-[#FF0000] bg-[#FF0000]/12 border-[#FF0000]/35 hover:bg-[#FF0000]/25 hover:border-[#FF0000] hover:shadow-[0_0_14px_rgba(255,0,0,0.55)]',
    badge: 'YouTube',
    icon: ({ className = 'w-4 h-4' }) => (
      <svg viewBox="0 0 24 24" fill="#FF0000" className={className} aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: 'orcid',
    name: 'ORCID',
    ariaLabel: 'ORCID Record of Dr. Prabh Deep Singh',
    url: 'https://orcid.org/',
    colorClass: 'text-[#A6CE39] bg-[#A6CE39]/12 border-[#A6CE39]/35 hover:bg-[#A6CE39]/25 hover:border-[#A6CE39] hover:shadow-[0_0_14px_rgba(166,206,57,0.55)]',
    badge: 'ORCID',
    icon: ({ className = 'w-4 h-4' }) => (
      <svg viewBox="0 0 24 24" fill="#A6CE39" className={className} aria-hidden="true">
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.949-.947c0-.516.422-.947.949-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.306v7.428h2.244c2.531 0 3.969-1.631 3.969-3.712 0-2.031-1.406-3.716-3.869-3.716h-2.344z" />
      </svg>
    ),
  },
  {
    id: 'github',
    name: 'GitHub',
    ariaLabel: 'GitHub Repositories of Dr. Prabh Deep Singh',
    url: 'https://github.com/',
    colorClass: 'text-[#F0F6FC] bg-white/[0.08] border-white/25 hover:bg-white/20 hover:border-white/60 hover:shadow-[0_0_14px_rgba(240,246,252,0.4)]',
    badge: 'GitHub',
    icon: ({ className = 'w-4 h-4' }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
];

interface SocialIconsProps {
  className?: string;
  itemClassName?: string;
  iconSize?: string;
  showTooltips?: boolean;
}

export default function SocialIcons({
  className = '',
  itemClassName = '',
  iconSize = 'w-3.5 h-3.5',
  showTooltips = true,
}: SocialIconsProps) {
  return (
    <div className={`flex items-center gap-1 sm:gap-1.5 ${className}`}>
      {SOCIAL_LINKS.map((item) => {
        const IconComponent = item.icon;
        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={item.name}
            aria-label={item.ariaLabel}
            className={`
              relative group
              w-7 h-7 sm:w-8 sm:h-8
              rounded-full
              flex items-center justify-center
              border
              transition-all duration-200
              hover:scale-115 active:scale-95
              shadow-[0_2px_8px_rgba(0,0,0,0.25)]
              ${item.colorClass}
              ${itemClassName}
            `}
          >
            <IconComponent className={iconSize} />

            {showTooltips && (
              <span
                className="
                  pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2
                  px-2 py-0.5 rounded-md
                  text-[10px] font-medium tracking-wide
                  bg-[#061524] text-white/95
                  border border-white/15 shadow-xl
                  opacity-0 group-hover:opacity-100
                  transition-all duration-150 delay-75
                  whitespace-nowrap z-50
                "
              >
                {item.name}
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
}
