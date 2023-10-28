import { Role } from "@/model/Role"
import styles from './styles.module.css'

type Props = {
    roles: Role[],
    edit?: (id: number) => void,
    remove?: (id: number) => void
}

export default function RoleList({ roles, edit, remove }: Props){
    return (
        <div>
            {
                roles?.map(role => (
                    <div key={role.id} className={styles.lineItem}>
                        <span className={styles.nameLabel}>{role.name}</span>
                        <span className={styles.rolenameLabel}>{role.description}</span>                        
                    </div>
                ))
            }
        </div>
    )

}