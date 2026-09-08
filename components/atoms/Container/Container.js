import styles from "./Container.module.css";

export default function Container({ children, className = "", as: Tag = "div" }) {
  return <Tag className={`${styles.container} ${className}`}>{children}</Tag>;
}
