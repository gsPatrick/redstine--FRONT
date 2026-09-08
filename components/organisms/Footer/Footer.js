import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/atoms/Icon/Icon";
import {
  footerTagline,
  footerColumns,
  legalLinks,
  contactItems,
  paymentImages,
  securitySeal,
  socialLinks,
  copyright,
} from "@/lib/footer";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Image
            src="/images/2026/07/Estudo-de-marca-RED_page-0001-1.jpg"
            alt="REDestine"
            width={735}
            height={252}
            className={styles.brandMark}
          />
          <div className={styles.tagline}>
            {footerTagline.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        <div className={styles.columns}>
          {footerColumns.map((column) => (
            <nav key={column.title} className={styles.column} aria-label={column.title}>
              <h3 className={styles.columnTitle}>{column.title}</h3>
              <ul className={styles.columnList}>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={styles.columnLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={styles.columns}>
          <nav className={styles.column} aria-label="Legal">
            <h3 className={styles.columnTitle}>Legal</h3>
            <ul className={styles.columnList}>
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.columnLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Contato</h3>
            <ul className={styles.columnList}>
              {contactItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={styles.columnLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className={styles.social}>
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={styles.socialLink} aria-label={item.label}>
                    <Icon name={item.icon} size={15} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Meios de Pagamento</h3>
            <ul className={styles.payments}>
              {paymentImages.map((image) => (
                <li key={image.src}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className={styles.paymentImage}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Site Seguro</h3>
            <div className={styles.seals}>
              <a
                href="https://transparencyreport.google.com/safe-browsing/search?"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sealLink}
              >
                <Image
                  src="/images/2026/07/20191019121420_4742995258.png"
                  alt="Google Site Seguro — clique para verificar"
                  width={325}
                  height={125}
                  className={styles.seal}
                />
              </a>
              <Image
                src={securitySeal.src}
                alt={securitySeal.alt}
                width={securitySeal.width}
                height={securitySeal.height}
                className={styles.seal}
              />
            </div>
          </div>
        </div>

        <p className={styles.copyright}>{copyright}</p>
      </div>
    </footer>
  );
}
