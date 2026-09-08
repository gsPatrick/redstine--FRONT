import Icon from "@/components/atoms/Icon/Icon";
import styles from "./WhatsAppFab.module.css";

export default function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/5521997469757"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.fab}
      aria-label="Falar no WhatsApp"
    >
      <Icon name="whatsapp" size={40} />
    </a>
  );
}
