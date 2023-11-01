import React from 'react';
import styles from './style.module.css'
interface MultiSelectRolesProps {
  options: { value: string; label: string }[];
  selectedRoles: string[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value : string;
}

const MultiSelectRoles: React.FC<MultiSelectRolesProps> = ({ options, selectedRoles, onChange, value }) => {
  return (
    <>
    <div className={styles.divInput}>
    <label  className={styles.label}>{value}: </label>
    <select className={styles.input} multiple  onChange={onChange}>
      {options.map((role) => (
        <option key={role.value} value={role.value} >
          {role.label}
        </option>
      ))}
    </select>
    </div>
    </>
  );
};

export default MultiSelectRoles;
