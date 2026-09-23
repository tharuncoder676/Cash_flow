/**
 * Brand and utility glyphs.
 *
 * Drawn inline rather than loaded from an icon font so they inherit
 * `currentColor`, stay crisp at any size, and cost no extra request. Each
 * is decorative by default — the surrounding link carries the label — so
 * they are hidden from assistive tech unless given a title.
 */

type IconProps = {
  className?: string;
  title?: string;
};

function wrap(title?: string) {
  return title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const, focusable: "false" as const };
}

export function WhatsAppIcon({ className = "h-4 w-4", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...wrap(title)}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.25-4.38c0-4.54 3.7-8.24 8.25-8.24a8.19 8.19 0 0 1 8.23 8.25c0 4.54-3.7 8.23-8.24 8.23z" />
    </svg>
  );
}

export function LinkedInIcon({ className = "h-4 w-4", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...wrap(title)}>
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM2.4 9.75h5.16V21H2.4V9.75zM9.96 9.75h4.95v1.54h.07c.69-1.24 2.37-2.55 4.88-2.55 5.22 0 6.18 3.3 6.18 7.6V21h-5.16v-3.76c0-1.79-.03-4.1-2.6-4.1-2.6 0-3 1.95-3 3.97V21H9.96V9.75z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-4 w-4", title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...wrap(title)}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.81 3.81 0 0 1-1.38-.9 3.81 3.81 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 2.13c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.64 3.64 0 0 0-.88-1.35 3.64 3.64 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.59-.07-4.74-.07z" />
      <path d="M12 15.33a3.33 3.33 0 1 1 0-6.66 3.33 3.33 0 0 1 0 6.66zm0-8.46a5.13 5.13 0 1 0 0 10.26 5.13 5.13 0 0 0 0-10.26zM18.54 6.67a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
    </svg>
  );
}

export function MailIcon({ className = "h-4 w-4", title }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...wrap(title)}
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6.5 9 6.5 9-6.5" />
    </svg>
  );
}

export function PhoneIcon({ className = "h-4 w-4", title }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...wrap(title)}
    >
      <path d="M21 16.5v2.6a1.9 1.9 0 0 1-2.07 1.9 18.8 18.8 0 0 1-8.2-2.91 18.5 18.5 0 0 1-5.7-5.7A18.8 18.8 0 0 1 2.12 4.1 1.9 1.9 0 0 1 4 2h2.6a1.9 1.9 0 0 1 1.9 1.63c.12.9.34 1.79.66 2.63a1.9 1.9 0 0 1-.43 2l-1.1 1.1a15.2 15.2 0 0 0 5.7 5.7l1.1-1.1a1.9 1.9 0 0 1 2-.43c.84.32 1.72.54 2.63.66A1.9 1.9 0 0 1 21 16.5z" />
    </svg>
  );
}

export function PinIcon({ className = "h-4 w-4", title }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...wrap(title)}
    >
      <path d="M20 10.5c0 5.4-8 12-8 12s-8-6.6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10.3" r="2.8" />
    </svg>
  );
}

export function ClockIcon({ className = "h-4 w-4", title }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...wrap(title)}
    >
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 6.8V12l3.4 2" />
    </svg>
  );
}

/** The Independent Advisors monogram, redrawn as a lockup mark. */
export function IAMonogram({ className = "h-7 w-7", title }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...wrap(title)}>
      <rect width="32" height="32" rx="3" fill="currentColor" opacity="0.1" />
      <path
        d="M9 9.5v13"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="m16.4 22.5 4.2-13 4.2 13M17.9 18.6h5.4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
