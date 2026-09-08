import Link from "next/link";
import styles from "./Button.module.css";

export default function Button({
  children,
  href,
  variant = "solid",
  size = "md",
  className = "",
  ...rest
}) {
  const cls = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls} {...rest}>
        <span className={styles.label}>{children}</span>
      </Link>
    );
  }

  return (
    <button type="button" className={cls} {...rest}>
      <span className={styles.label}>{children}</span>
    </button>
  );
}
