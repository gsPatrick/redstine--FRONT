import Link from "next/link";
import Image from "next/image";
import styles from "./Logo.module.css";

export default function Logo({ className = "", priority = false }) {
  return (
    <Link href="/" className={`${styles.logo} ${className}`} aria-label="RED — página inicial">
      <Image
        src="/images/2026/07/Estudo-de-marca-RED_page-0001-1.jpg"
        alt="REDestine"
        width={735}
        height={252}
        priority={priority}
        sizes="(max-width: 735px) 100vw, 735px"
        className={styles.image}
      />
    </Link>
  );
}
