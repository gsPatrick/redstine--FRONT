import Section from "@/components/atoms/Section/Section";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import styles from "./ComparisonTable.module.css";

export default function ComparisonTable({ title, columns, rows }) {
  return (
    <Section tone="light">
      <SectionTitle title={title} />

      <div className={styles.scroller}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col" className={styles.corner} />
              {columns.map((column) => (
                <th key={column} scope="col" className={styles.head}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className={styles.label}>
                  {row.label}
                </th>
                {row.values.map((value, index) => (
                  <td key={`${row.label}-${index}`} className={styles.cell}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
