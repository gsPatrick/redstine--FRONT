import Link from "next/link";
import PanelIcon from "../PanelIcon/PanelIcon";
import styles from "./PanelButton.module.css";

export default function PanelButton({
  children,
  href,
  variant = "solid",
  size = "md",
  icon,
  iconRight,
  className = "",
  ...rest
}) {
  const cls = `${styles.btn} ${styles[variant]} ${styles[size]} ${className}`;

  const conteudo = (
    <>
      {icon && <PanelIcon name={icon} size={size === "sm" ? 14 : 16} />}
      <span>{children}</span>
      {iconRight && <PanelIcon name={iconRight} size={size === "sm" ? 14 : 16} />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} {...rest}>
        {conteudo}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} {...rest}>
      {conteudo}
    </button>
  );
}
