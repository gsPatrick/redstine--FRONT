import styles from "./PanelIcon.module.css";

/**
 * Iconografia do painel: traco de 1.6, cantos arredondados, grid 24.
 *
 * Separado do `Icon` do site — aquele usa silhuetas solidas em viewBox 512,
 * pensado para o catalogo. Misturar as duas linguagens numa mesma tela e o
 * tipo de detalhe que faz um painel parecer remendado.
 */
const paths = {
  // navegacao
  overview: ["M3 12l9-8 9 8", "M5 10v10h14V10"],
  cart: ["M3 4h2l2.4 11.2a2 2 0 002 1.6h7.8a2 2 0 002-1.6L21 8H6", "M9 21h.01", "M17 21h.01"],
  chat: ["M21 12a8 8 0 01-8 8H8l-5 3 1.4-4.2A8 8 0 1121 12z"],
  heart: ["M20.8 6.6a4.7 4.7 0 00-6.7 0L12 8.7l-2.1-2.1a4.7 4.7 0 10-6.7 6.7L12 22l8.8-8.7a4.7 4.7 0 000-6.7z"],
  chart: ["M4 20V10", "M10 20V4", "M16 20v-7", "M22 20H2"],
  box: ["M21 8l-9-5-9 5 9 5 9-5z", "M3 8v8l9 5 9-5V8", "M12 13v8"],
  tag: ["M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0l-7.2-7.2a2 2 0 01-.6-1.4V4a1 1 0 011-1h8a2 2 0 011.4.6l7.4 7.4a2 2 0 010 2.4z", "M7.5 7.5h.01"],
  wallet: ["M3 7a2 2 0 012-2h13a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z", "M16 12h4", "M3 9h18"],
  upload: ["M12 16V4", "M8 8l4-4 4 4", "M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"],
  user: ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 11a4 4 0 100-8 4 4 0 000 8z"],
  building: ["M4 21V5a2 2 0 012-2h8a2 2 0 012 2v16", "M16 9h2a2 2 0 012 2v10", "M8 7h2", "M8 11h2", "M8 15h2", "M2 21h20"],
  pin: ["M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z", "M12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"],
  lock: ["M5 11h14a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8a1 1 0 011-1z", "M8 11V7a4 4 0 118 0v4"],
  logout: ["M15 17l5-5-5-5", "M20 12H9", "M11 3H5a2 2 0 00-2 2v14a2 2 0 002 2h6"],
  users: ["M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2", "M9 11a4 4 0 100-8 4 4 0 000 8z", "M22 21v-2a4 4 0 00-3-3.9", "M17 3.1a4 4 0 010 7.8"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  settings: ["M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z", "M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5v.2a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H2a2 2 0 010-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V2a2 2 0 014 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1h.2a2 2 0 010 4h-.1a1.6 1.6 0 00-1.5 1z"],
  report: ["M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z", "M14 3v5h5", "M9 13h6", "M9 17h6"],

  // acoes e sinalizacao
  bell: ["M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8z", "M13.7 21a2 2 0 01-3.4 0"],
  eye: ["M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z", "M12 15a3 3 0 100-6 3 3 0 000 6z"],
  search: ["M11 19a8 8 0 100-16 8 8 0 000 16z", "M21 21l-4.3-4.3"],
  filter: ["M3 5h18l-7 8v6l-4 2v-8z"],
  chevronDown: ["M6 9l6 6 6-6"],
  chevronLeft: ["M15 18l-6-6 6-6"],
  chevronRight: ["M9 18l6-6-6-6"],
  arrowLeft: ["M19 12H5", "M11 18l-6-6 6-6"],
  arrowUp: ["M12 19V5", "M6 11l6-6 6 6"],
  arrowDown: ["M12 5v14", "M18 13l-6 6-6-6"],
  check: ["M20 6L9 17l-5-5"],
  checkCircle: ["M22 11.1V12a10 10 0 11-5.9-9.1", "M22 4l-10 10-3-3"],
  clock: ["M12 22a10 10 0 100-20 10 10 0 000 20z", "M12 6v6l4 2"],
  alert: ["M12 9v4", "M12 17h.01", "M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"],
  plus: ["M12 5v14", "M5 12h14"],
  menu: ["M3 6h18", "M3 12h18", "M3 18h18"],
  close: ["M18 6L6 18", "M6 6l12 12"],
  truck: ["M3 16V6a1 1 0 011-1h9v11", "M13 9h4l3 3v4h-7", "M7.5 19a2 2 0 100-4 2 2 0 000 4z", "M17.5 19a2 2 0 100-4 2 2 0 000 4z"],
  trend: ["M22 7l-8.5 8.5-4-4L2 19", "M16 7h6v6"],
  calendar: ["M5 5h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z", "M16 3v4", "M8 3v4", "M4 11h16"],
  download: ["M12 4v12", "M8 12l4 4 4-4", "M4 20h16"],
  trash: ["M4 7h16", "M10 11v6", "M14 11v6", "M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13", "M9 7V4h6v3"],
  image: ["M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z", "M8.5 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z", "M21 16l-5-5-9 9"],
};

export default function PanelIcon({ name, size = 18, className = "", strokeWidth = 1.6 }) {
  const d = paths[name];
  if (!d) return null;

  return (
    <svg
      className={`${styles.icon} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {d.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}

export { paths as panelIconNames };
